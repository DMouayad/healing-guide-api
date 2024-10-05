import { IUser, type IUserProps } from "@/interfaces/IUser";
import { faker } from "@faker-js/faker";
import { APP_ROLES } from "../types";

type UserFactoryParams = Partial<IUserProps>;
type UserFactoryOpts = { hasVerifiedEmail?: boolean; hasVerifiedPhoneNo?: boolean };
class FakeUser extends IUser {}

function createUser(props?: UserFactoryParams, opts?: UserFactoryOpts): FakeUser {
	return new FakeUser({
		// @ts-ignore
		id: props?.id,
		// @ts-ignore
		passwordHash: props?.passwordHash,
		role: props?.role ?? APP_ROLES.guest,
		fullName: props?.fullName ?? faker.person.fullName(),
		activated: props?.activated ?? false,
		email: props?.email ?? faker.internet.email(),
		emailVerifiedAt: opts?.hasVerifiedEmail ? new Date() : (props?.emailVerifiedAt ?? null),
		phoneNumberVerifiedAt: opts?.hasVerifiedPhoneNo ? new Date() : (props?.phoneNumberVerifiedAt ?? null),
		phoneNumber: props?.phoneNumber ?? faker.phone.number(),
	});
}
function createAdminUser(props?: UserFactoryParams, opts?: UserFactoryOpts) {
	return createUser({ ...props, role: APP_ROLES.admin }, opts);
}
export const userFactory = {
	create: createUser,
	createAdmin: createAdminUser,
} as const;
