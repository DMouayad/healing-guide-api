import type { ClassProperties, Role } from "@/common/types";

export type IUserProps = ClassProperties<IUser>;
export abstract class IUser {
	readonly id: string;
	readonly role: Role;
	readonly passwordHash: string;
	fullName: string;
	activated: boolean;
	email: string;
	phoneNumber: string;
	emailVerifiedAt: Date | null;
	phoneNumberVerifiedAt: Date | null;
	readonly createdAt: Date;

	constructor(props: IUserProps) {
		this.activated = props.activated;
		this.email = props.email;
		this.emailVerifiedAt = props.emailVerifiedAt;
		this.phoneNumber = props.phoneNumber;
		this.phoneNumberVerifiedAt = props.phoneNumberVerifiedAt;
		this.createdAt = props.createdAt;
		this.passwordHash = props.passwordHash;
		this.id = props.id;
		this.role = props.role;
		this.fullName = props.fullName;
	}
}
