import type { AccessToken } from "@/common/models/accessToken";
import { objectToCamel } from "ts-case-convert";

export type KyselyQueryAccessToken = {
	id: number;
	user_id: number;
	hash: string;
	created_at: string;
	expires_at: string;
	fingerprint: string | null;
	last_used_at: string | null;
};
export function accessTokenFromKyselyQuery(token: KyselyQueryAccessToken): AccessToken {
	return {
		...objectToCamel(token),
		createdAt: new Date(token.created_at),
		expiresAt: new Date(token.expires_at),
		lastUsedAt: token.last_used_at ? new Date(token.last_used_at) : null,
	};
}
