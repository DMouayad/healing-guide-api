import type { Role } from "@common/types";
import type { CreateUserDTO, IUser, UpdateUserDTO } from "./IUser";

export interface IUserRepository<User extends IUser = IUser> {
	getWithRoles(roles: Role[]): Promise<IUser[]>;
	find(id: number): Promise<User | undefined>;
	findByEmailOrPhoneNumber(emailOrPhoneNo: string): Promise<User | undefined>;
	verifyCredentialsAreUnique(phoneNumber?: string, email?: string): Promise<boolean>;
	update(user: User, params: UpdateUserDTO): Promise<User | undefined>;
	updateById(id: number, params: UpdateUserDTO): Promise<User | undefined>;
	updateUserPassword(emailOrPhoneNo: string, newPassword: string): Promise<void>;
	delete(user: User): Promise<User | undefined>;
	create(dto: CreateUserDTO): Promise<User | undefined>;
}
