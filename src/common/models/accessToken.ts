export type AccessToken = {
	readonly userId: string;
	readonly fingerprint: string | null;
	readonly abilities: string | string[] | null;
	readonly hash: string;
	readonly expiresAt: Date;
	readonly lastUsedAt?: Date | null;
	readonly createdAt: Date;
};
