import type { IUser } from "./IUser";

export interface IUserService<User extends IUser = IUser> {
	getUserById(_id: number): Promise<User | undefined>;
	updateUser(_id: number, fullName?: string, email?: string, phoneNumber?: string): Promise<User | undefined>;
	deleteUserById(_id: number): Promise<User | undefined>;
}
