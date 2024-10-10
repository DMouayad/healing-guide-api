import type { Role } from "@/common/types";
import type { CreateUserDTO, IUser, UpdateUserDTO } from "./IUser";

export interface IUserRepository<User extends IUser = IUser> {
	getWithRoles(roles: Role[]): Promise<IUser[]>;
	find(id: number): Promise<User | undefined>;
	update(user: User, params: UpdateUserDTO): Promise<User | undefined>;
	updateById(id: number, params: UpdateUserDTO): Promise<User | undefined>;
	delete(user: User): Promise<User | undefined>;
}
