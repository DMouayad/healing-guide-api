import type { IUser } from "@/interfaces/IUser";
import type { NOTIFICATIONS } from "./constants";
import type { AccessToken } from "./models/accessToken";
import type { AppErrCode } from "./models/errorCodes";

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
export type ApiResponse = {
	data?: object;
	appError?: { message: string; errCode: AppErrCode; description?: string };
};
export type ExtractedBearerToken = {
	tokenId?: number;
	tokenStr: string;
};

export type CreateAccessTokenParams = {
	tokenableId: number;
	name: string;
	expirationInMinutes?: number;
};
export type NewAccessToken = {
	token: AccessToken;
	plainTextToken: string;
};
export type AuthState = {
	personalAccessToken: AccessToken;
	user: IUser;
};
export type NotificationId = string;

export type SocketNotification = {
	id: string;
	channel: number;
	senderId: string;
	message: string;
};
export type MailRecipient = {
	to: string;
	cc?: string;
};

export type NotificationType = ObjectValues<typeof NOTIFICATIONS>;

export type Role = ObjectValues<typeof APP_ROLES>;

export const APP_ROLES = {
	guest: { roleId: 1, slug: "guest" },
	admin: { roleId: 2, slug: "admin" },
	patient: { roleId: 3, slug: "patient" },
	facilityManager: { roleId: 4, slug: "facilityManager" },
	physician: { roleId: 5, slug: "physician" },
} as const;
