import type { IUser } from "@/interfaces/IUser";
import type { AccessToken } from "./models/accessToken";

// =================== Utils types ======================
export type ObjectValues<T> = T[keyof T];
export type ClassProperties<C> = {
	// biome-ignore lint/complexity/noBannedTypes: it's ok to use the `Function` type here, I guess.
	[Key in keyof C as C[Key] extends Function ? never : Key]: C[Key];
};
export type RequireAtLeastOne<T> = {
	[K in keyof T]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<keyof T, K>>>;
}[keyof T];

/**Constructs a new type created from OriginalType properties(Keys) and replace */
export type RenameKeys<NewKeys, OriginalType> = Required<{
	[K in keyof OriginalType as K extends keyof NewKeys
		? NewKeys[K] extends string
			? NewKeys[K]
			: never
		: K]: K extends keyof OriginalType ? OriginalType[K] : never;
}>;
// ================= End of Utils types ===================

export type ExtractedBearerToken = {
	tokenId?: number;
	tokenStr: string;
};

export type CreateAccessTokenParams = {
	tokenableId: number;
	name: string;
	expirationInMinutes?: number;
};

export type AuthState = {
	personalAccessToken: AccessToken;
	user: IUser;
};

export type SocketNotification = {
	id: string;
	channel: number;
	senderId: string;
	message: string;
};

export type Role = ObjectValues<typeof APP_ROLES>;

export const APP_ROLES = {
	guest: { roleId: 1, slug: "guest" },
	admin: { roleId: 2, slug: "admin" },
	patient: { roleId: 3, slug: "patient" },
	facilityManager: { roleId: 4, slug: "facilityManager" },
	physician: { roleId: 5, slug: "physician" },
} as const;

/** Time-based OTP issued for a user */
export type UserTOTP = {
	user: IUser;
	expiresAt: Date;
	code: string;
};
