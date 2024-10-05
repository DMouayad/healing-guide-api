import type { AccessToken } from "@/common/models/accessToken";
import AppError from "@/common/models/appError";
import type { ExtractedBearerToken } from "@/common/types";
import { sha256 } from "@/common/utils/hashing";
import { logger } from "@/common/utils/logger";
import { db } from "@/db";
import { addSelectUser } from "@/db/kyselyRelations";
import type { IAuthTokensRepository, TokenId } from "@/interfaces/IAuthTokensRepository";
import { jsonObjectFrom } from "kysely/helpers/postgres";
import { objectToCamel } from "ts-case-convert";
import { DBUser, type KyselyQueryUser } from "../user/user.model";

type TokenAndUserSelectQueryResult = {
	user: KyselyQueryUser;
	token: {
		id: number;
		user_id: number;
		hash: string;
		created_at: Date;
		expires_at: Date;
		fingerprint: string | null;
		last_used_at: Date | null;
	};
};
export class DBAuthTokensRepository implements IAuthTokensRepository<AccessToken, DBUser> {
	async findTokenAndUser(bearerToken: ExtractedBearerToken): Promise<[AccessToken, DBUser]> {
		let matchingTokenAndUser: TokenAndUserSelectQueryResult | undefined;
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
		const user = DBUser.fromQueryResult(matchingTokenAndUser.user);
		const matchingToken: AccessToken = objectToCamel(matchingTokenAndUser.token);
		if (
			!matchingToken ||
			tokenHash !== matchingToken.hash ||
			(bearerToken.tokenId && matchingToken.id !== bearerToken.tokenId)
		) {
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

	private async findByTokenHash(hash: string): Promise<TokenAndUserSelectQueryResult | undefined> {
		return this.findTokenBaseQuery()
			.select((eb) =>
				jsonObjectFrom(eb.selectFrom("personal_access_tokens").where("hash", "=", hash).selectAll())
					.$notNull()
					.as("token"),
			)
			.executeTakeFirst();
	}

	async findById(id: number): Promise<TokenAndUserSelectQueryResult | undefined> {
		return this.findTokenBaseQuery()
			.select((eb) =>
				jsonObjectFrom(eb.selectFrom("personal_access_tokens").where("id", "=", id).selectAll())
					.$notNull()
					.as("token"),
			)
			.executeTakeFirst();
	}

	private findTokenBaseQuery() {
		return db.selectFrom("personal_access_tokens as pat").select(({ ref }) => addSelectUser(ref("user_id")).as("user"));
	}

	async storeToken(token: AccessToken): Promise<TokenId> {
		return db
			.insertInto("personal_access_tokens")
			.values({
				created_at: token.createdAt,
				last_used_at: token.lastUsedAt,
				fingerprint: token.fingerprint,
				user_id: token.userId,
				expires_at: token.expiresAt,
				hash: token.hash,
			})
			.returning("id")
			.executeTakeFirst()
			.then((storedToken) => storedToken?.id);
	}
}
