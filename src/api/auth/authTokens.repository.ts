import type { AccessToken } from "@/common/models/accessToken";
import AppError from "@/common/models/appError";
import type { ExtractedBearerToken } from "@/common/types";
import { sha256 } from "@/common/utils/hashing";
import { logger } from "@/common/utils/logger";
import { db } from "@/db";
import type { IAuthTokensRepository, TokenId } from "@/interfaces/IAuthTokensRepository";
import { objectToCamel } from "ts-case-convert";
import { DBUser } from "../user/user.model";

export class DBAuthTokensRepository implements IAuthTokensRepository<AccessToken, DBUser> {
	async findTokenAndUser(bearerToken: ExtractedBearerToken): Promise<[AccessToken, DBUser]> {
		let matchingTokenAndUser: any;
		const tokenHash = sha256(bearerToken.tokenStr);

		if (bearerToken.tokenId) {
			matchingTokenAndUser = await this.findById(bearerToken.tokenId);
		}
		// else try finding a matching token it by the bearer token
		// which is expected to be the token hash
		matchingTokenAndUser ??= await this.findByTokenHash(tokenHash);

		if (!matchingTokenAndUser) {
			throw AppError.INVALID_ACCESS_TOKEN({ description: "Token not found" });
		}
		const [user, matchingToken] = this.extractUserAndToken(matchingTokenAndUser);

		if (!matchingToken || tokenHash !== matchingToken.hash) {
			logger.warn("Bearer token value does not match its original one");
			throw AppError.INVALID_ACCESS_TOKEN();
		}
		if (!user) {
			logger.warn("Request received with bearer token belonging to a deleted user");
			throw AppError.INVALID_ACCESS_TOKEN();
		}
		if (user.id !== matchingToken.userId) {
			logger.warn("Request received with bearer token belonging to a different user");
			throw AppError.INVALID_ACCESS_TOKEN();
		}
		return [matchingToken, user];
	}

	private async findByTokenHash(hash: string) {
		return await this.findTokenBaseQuery()
			.where("pat.token", "=", hash)
			.innerJoin("users", "pat.user_id", "users.id")
			.select([
				"pat.id as tokenId",
				"users.id as userId",
				"pat.created_at as tokenCreatedAt",
				"users.created_at as userCreatedAt",
			])
			.selectAll(["users", "pat"])
			.executeTakeFirst();
	}

	private async findById(id: string) {
		return await this.findTokenBaseQuery()
			.where("pat.id", "=", id)
			.innerJoin("users", "pat.user_id", "users.id")
			.select([
				"pat.id as tokenId",
				"users.id as userId",
				"pat.created_at as tokenCreatedAt",
				"users.created_at as userCreatedAt",
			])
			.selectAll(["users", "pat"])
			.executeTakeFirst();
	}

	private findTokenBaseQuery() {
		return db.selectFrom("personal_access_tokens as pat");
	}
	private extractUserAndToken(kyselyJoinedQueryResult: any): [DBUser | undefined, AccessToken | undefined] {
		// this is because we get a snake_case variables from Kysely
		const obj: any = objectToCamel(kyselyJoinedQueryResult);
		let user: DBUser | undefined;
		let token: AccessToken | undefined;
		if (obj.userId) {
			user = new DBUser(obj);
		}
		if (obj.userId && obj.hash) {
			token = {
				userId: obj.userId,
				createdAt: obj.tokenCreatedAt,
				expiresAt: obj.expiresAt,
				hash: obj.token,
				fingerprint: obj.fingerprint,
				lastUsedAt: obj.lastUsedAt,
			};
		}
		return [user, token];
	}

	async storeToken(token: AccessToken): Promise<TokenId> {
		const storedToken = await db
			.insertInto("personal_access_tokens")
			.values({
				created_at: token.createdAt,
				last_used_at: token.lastUsedAt,
				fingerprint: token.fingerprint,
				user_id: token.userId,
				expires_at: token.expiresAt,
				token: token.hash,
			})
			.returningAll()
			.executeTakeFirst();
		if (storedToken) {
			return storedToken.id;
		}
	}
}
