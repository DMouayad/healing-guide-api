import { ASSIGNABLE_ROLES } from "@/common/constants";
import {
	APP_ROLES,
	type ClassProperties,
	type RequireAtLeastOne,
	type Role,
} from "@/common/types";
import { logger } from "@/common/utils/logger";
import { IHasAuthorization } from "./IHasAuthorization";

export type IUserProps = ClassProperties<IUser>;
export abstract class IUser extends IHasAuthorization {
	readonly id: number;
	override readonly role: Role;
	readonly passwordHash: string;
	fullName: string;
	activated: boolean;
	email: string;
	phoneNumber: string;
	emailVerifiedAt: Date | null;
	phoneNumberVerifiedAt: Date | null;
	identityConfirmedAt: Date | null;
	readonly createdAt: Date;

	constructor(props: IUserProps) {
		super();
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
		this.identityConfirmedAt = props.identityConfirmedAt;
	}
}
export type UpdateUserDTO = RequireAtLeastOne<{
	readonly fullName: string;
	readonly email: string;
	readonly phoneNumber: string;
	readonly activated: boolean;
	readonly phoneNumberVerifiedAt: Date;
	readonly emailVerifiedAt: Date;
	readonly identityConfirmedAt: Date;
}>;
export class CreateUserDTO {
	readonly role: Role;
	readonly fullName: string;
	readonly email: string;
	readonly phoneNumber: string;
	readonly activated: boolean;
	readonly password: string;

	constructor(props: ClassProperties<CreateUserDTO>) {
		this.fullName = props.fullName;
		this.email = props.email;
		this.phoneNumber = props.phoneNumber;
		this.password = props.password;
		this.activated = props.activated;

		const isAssignableRole = ASSIGNABLE_ROLES.find((el) => el === props.role);
		if (isAssignableRole) {
			this.role = props.role;
		} else {
			logger.warn(`An attempt was made to assign the role "${props.role.slug}"`);
			this.role = APP_ROLES.guest;
		}
	}
}
