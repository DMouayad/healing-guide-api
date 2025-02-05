import type { AccessToken } from "src/common/models/accessToken";
import type { ExtractedBearerToken } from "src/common/types";
import type { IUser } from "./IUser";

export type TokenId = number | undefined;

export interface IAuthTokensRepository<
	Token extends AccessToken = AccessToken,
	User extends IUser = IUser,
> {
	findTokenAndUser(bearerToken: ExtractedBearerToken): Promise<[Token, User]>;
	storeToken(token: AccessToken): Promise<TokenId>;
	deleteToken(token: AccessToken): Promise<boolean>;
	deleteUserTokens(userId: number): Promise<void>;
}
