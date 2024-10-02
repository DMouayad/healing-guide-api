import type { AccessToken } from "@/common/models/accessToken";
import type { ExtractedBearerToken } from "@/common/types";
import type { IUser } from "./IUser";

export type TokenId = string | undefined;

export interface IAuthTokensRepository<Token extends AccessToken = AccessToken, User extends IUser = IUser> {
	findTokenAndUser(bearerToken: ExtractedBearerToken): Promise<[Token, User]>;
	storeToken(token: AccessToken): Promise<TokenId>;
}