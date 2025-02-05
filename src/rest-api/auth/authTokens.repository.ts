import { sql } from "kysely";
import { jsonBuildObject, jsonObjectFrom } from "kysely/helpers/postgres";
import type { AccessToken } from "src/common/models/accessToken";
import AppError from "src/common/models/appError";
import type { ExtractedBearerToken } from "src/common/types";
import { sha256 } from "src/common/utils/hashing";
import { logger } from "src/common/utils/logger";
import { db } from "src/db/index";
import type {
	IAuthTokensRepository,
	TokenId,
} from "src/interfaces/IAuthTokensRepository";
import { objectToSnake } from "ts-case-convert";
import { DBUser, type KyselyQueryUser } from "../user/user.model";
import { type KyselyQueryAccessToken, accessTokenFromKyselyQuery } from "./auth.types";

type TokenAndUserSelectQueryResult = {
	user: KyselyQueryUser;
	token: KyselyQueryAccessToken;
};
export class DBAuthTokensRepository
	implements IAuthTokensRepository<AccessToken, DBUser>
{
	async deleteUserTokens(userId: number): Promise<void> {
		return db
			.deleteFrom("personal_access_tokens")
			.where("user_id", "=", userId)
			.execute()
			.then((result) => {
				if (result.length === 0) {
					logger.warn("");
				}
			});
	}
	async findTokenAndUser(
		bearerToken: ExtractedBearerToken,
	): Promise<[AccessToken, DBUser]> {
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
		const matchingToken: AccessToken = accessTokenFromKyselyQuery(
			matchingTokenAndUser.token,
		);
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

	private async findByTokenHash(
		hash: string,
	): Promise<TokenAndUserSelectQueryResult | undefined> {
		return this.findTokenBaseQuery()
			.where("pat.hash", "=", hash)
			.executeTakeFirst()
			.then((result) => result?.obj);
	}

	async findById(id: number): Promise<TokenAndUserSelectQueryResult | undefined> {
		return this.findTokenBaseQuery()
			.where("pat.id", "=", id)
			.executeTakeFirst()
			.then((result) => result?.obj);
	}

	private findTokenBaseQuery() {
		return db
			.selectFrom("personal_access_tokens as pat")
			.select(({ eb, selectFrom }) => [
				jsonBuildObject({
					token: sql<KyselyQueryAccessToken>`pat.*`,
					user: jsonObjectFrom(
						selectFrom("users")
							.selectAll()
							.where("users.id", "=", eb.ref("pat.user_id")),
					).$notNull(),
				}).as("obj"),
			]);
	}

	async storeToken(token: AccessToken): Promise<TokenId> {
		return db
			.insertInto("personal_access_tokens")
			.values(objectToSnake(token))
			.returning("id")
			.executeTakeFirst()
			.then((storedToken) => storedToken?.id);
	}
	async deleteToken(token: AccessToken): Promise<boolean> {
		return db
			.deleteFrom("personal_access_tokens")
			.where("id", "=", token.id)
			.execute()
			.then((result) => {
				if (result.length !== 1) {
					logger.warn("Delete failed");
					return false;
				}
				return true;
			});
	}
}
