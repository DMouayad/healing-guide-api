import type { IUser } from "./IUser";

export interface IUserService<User extends IUser = IUser> {
	getUserById(id: string): Promise<User | undefined>;
	updateUserById(id: string, fullName?: string, email?: string, phoneNumber?: string): Promise<User | undefined>;
	deleteUserById(id: string): Promise<User | undefined>;
}
