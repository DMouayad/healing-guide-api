import type { IUser } from "src/interfaces/IUser";

export function UserResource(user: IUser) {
	return user
		? {
				activated: user.activated,
				email: user.email,
				emailVerifiedAt: user.emailVerifiedAt,
				phoneNumber: user.phoneNumber,
				phoneNumberVerifiedAt: user.phoneNumberVerifiedAt,
				createdAt: user.createdAt,
				role: user.role.slug,
			}
		: {};
}
