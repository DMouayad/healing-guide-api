import type { ClassProperties } from "@/common/types";
import type { IUser } from "@/interfaces/IUser";
export type UserResourceProps = ClassProperties<UserResource>;

export class UserResource {
	role: string;
	activated: boolean;
	email: string | null;
	phoneNumber: string;
	emailVerifiedAt: Date | null;
	phoneNumberVerifiedAt: Date | null;
	createdAt: Date;

	constructor(props: UserResourceProps) {
		this.activated = props.activated;
		this.email = props.email;
		this.emailVerifiedAt = props.emailVerifiedAt;
		this.phoneNumber = props.phoneNumber;
		this.phoneNumberVerifiedAt = props.phoneNumberVerifiedAt;
		this.createdAt = props.createdAt;
		this.role = props.role;
	}
	public static create(user: IUser): UserResource {
		return new UserResource({ ...user, role: user.role.slug });
	}
}
