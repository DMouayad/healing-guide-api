import type { IUser } from "@/interfaces/IUser";
import type { AccessToken } from "./models/accessToken";

export type ExtractedBearerToken = {
	tokenId?: string;
	tokenStr: string;
};

export type CreateAccessTokenParams = {
	tokenableId: string;
	name: string;
	abilities?: string | string[];
	expirationInMinutes?: number;
};
export type NewAccessToken = {
	token: AccessToken;
	plainTextToken: string;
};
export type AuthState = {
	personalAccessToken: AccessToken | undefined;
	user: IUser | undefined;
};
