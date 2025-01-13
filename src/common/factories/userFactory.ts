import { faker } from "@faker-js/faker";
import { IUser, type IUserProps } from "@interfaces/IUser";
import parsePhoneNumber from "libphonenumber-js";
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
		phoneNumber: params?.userProps?.phoneNumber ?? generateFakePhoneNumber(),
	});
}

function generateFakePhoneNumber() {
	const countryCode = "+963"; // Syria's country code

	// Syrian mobile numbers typically start with 9
	const mobilePrefixes = ["93", "94", "95", "96", "98", "99"]; // Common prefixes
	const prefix = mobilePrefixes[Math.floor(Math.random() * mobilePrefixes.length)];

	// Generate the remaining 7 digits
	let remainingDigits = "";
	for (let i = 0; i < 7; i++) {
		remainingDigits += Math.floor(Math.random() * 10);
	}

	const phoneNumber = `${countryCode}${prefix}${remainingDigits}`;
	const parsed = parsePhoneNumber(phoneNumber);
	return parsed!.format("INTERNATIONAL", { fromCountry: "SY" });
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
