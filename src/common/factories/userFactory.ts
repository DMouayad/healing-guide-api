import { IUser, type IUserProps } from "@/interfaces/IUser";
import { faker } from "@faker-js/faker";
import { APP_ROLES } from "../types";
import { bcryptHash } from "../utils/hashing";

type UserFactoryParams = {
	userProps?: Partial<IUserProps>;
	hasVerifiedEmail?: boolean;
	hasVerifiedPhoneNo?: boolean;
};
class FakeUser extends IUser {}

export async function createUser(params?: UserFactoryParams) {
	const email = params?.userProps?.email ?? faker.internet.email();

	const password = params?.userProps?.passwordHash ?? (await bcryptHash(email));
	return new FakeUser({
		// @ts-ignore
		id: params?.userProps?.id ?? faker.string.numeric(),
		passwordHash: password,
		role: params?.userProps?.role ?? APP_ROLES.guest,
		activated: params?.userProps?.activated ?? false,
		email: email,
		emailVerifiedAt: params?.hasVerifiedEmail
			? new Date()
			: (params?.userProps?.emailVerifiedAt ?? null),
		phoneNumberVerifiedAt: params?.hasVerifiedPhoneNo
			? new Date()
			: (params?.userProps?.phoneNumberVerifiedAt ?? null),
		phoneNumber: params?.userProps?.phoneNumber ?? faker.phone.number(),
	});
}
export async function createAdminUser(params?: UserFactoryParams) {
	return createUser({
		...params,
		userProps: { ...params?.userProps, role: APP_ROLES.admin },
	});
}
export async function createMany(count: number, params?: UserFactoryParams) {
	const users = Array(count);
	for (let index = 0; index < count; index++) {
		users[index] = await createUser(params);
	}
	return users;
}
