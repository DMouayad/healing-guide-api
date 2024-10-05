export type AccessToken = {
	readonly id: number;
	readonly userId: number;
	readonly fingerprint: string | null;
	readonly hash: string;
	readonly expiresAt: Date;
	readonly lastUsedAt?: Date | null;
	readonly createdAt: Date;
};
