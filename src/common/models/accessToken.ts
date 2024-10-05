export type AccessToken = {
	readonly id: string;
	readonly userId: string;
	readonly fingerprint: string | null;
	readonly hash: string;
	readonly expiresAt: Date;
	readonly lastUsedAt?: Date | null;
	readonly createdAt: Date;
};
