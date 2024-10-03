import type { RequireAtLeastOne } from "@/common/types";
import type { IUser } from "./IUser";

export interface IUserRepository<User extends IUser = IUser> {
	find(id: string): Promise<User | undefined>;
	update(
		user: User,
		{ fullName, email, phoneNumber, activated }: RequireAtLeastOne<UpdateUserParams>,
	): Promise<User | undefined>;
	delete(user: User): Promise<User | undefined>;
}

export type UpdateUserParams = {
	fullName: string;
	email: string;
	phoneNumber: string;
	activated: boolean;
};
