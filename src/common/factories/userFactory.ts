import { IUser, type IUserProps } from "@/interfaces/IUser";
import { faker } from "@faker-js/faker";
import { APP_ROLES } from "../types";
import { generateRandomString } from "../utils/hashing";

type UserFactoryParams = {
	userProps?: Partial<IUserProps>;
	opts?: UserFactoryOpts;
};
type UserFactoryOpts = { hasVerifiedEmail?: boolean; hasVerifiedPhoneNo?: boolean; generateRandomPassword?: boolean };
class FakeUser extends IUser {}

function createUser(params?: UserFactoryParams): FakeUser {
	return new FakeUser({
		// @ts-ignore
		id: params?.userProps?.id,
		// @ts-ignore
		passwordHash: opts?.generateRandomPassword ? generateRandomString(40) : params?.userProps?.passwordHash,
		role: params?.userProps?.role ?? APP_ROLES.guest,
		fullName: params?.userProps?.fullName ?? faker.person.fullName(),
		activated: params?.userProps?.activated ?? false,
		email: params?.userProps?.email ?? faker.internet.email(),
		emailVerifiedAt: params?.opts?.hasVerifiedEmail ? new Date() : (params?.userProps?.emailVerifiedAt ?? null),
		phoneNumberVerifiedAt: params?.opts?.hasVerifiedPhoneNo
			? new Date()
			: (params?.userProps?.phoneNumberVerifiedAt ?? null),
		phoneNumber: params?.userProps?.phoneNumber ?? faker.phone.number(),
	});
}
function createAdminUser(params?: UserFactoryParams) {
	return createUser({ userProps: { ...params?.userProps, role: APP_ROLES.admin }, opts: params?.opts });
}
function createMany(count: number, params?: UserFactoryParams) {
	const users: FakeUser[] = Array(count).fill(createUser(params));
	return users;
}
export const userFactory = {
	create: createUser,
	createAdmin: createAdminUser,
	createMany: createMany,
} as const;
