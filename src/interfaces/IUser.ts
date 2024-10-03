import type { Role } from "@/common/types";

export interface IUser {
	id: string;
	activated: boolean;
	fullName: string;
	email: string;
	passwordHash: string;
	phoneNumber: string;
	emailVerifiedAt: Date | null;
	phoneNumberVerifiedAt: Date | null;
	createdAt: Date;
	get role(): Role;
}
