import type { RequireAtLeastOne, Role } from "@/common/types";
import type { IUser } from "./IUser";

export interface IUserRepository<User extends IUser = IUser> {
	getWithRoles(roles: Role[]): Promise<IUser[]>;
	find(id: number): Promise<User | undefined>;
	update(user: User, params: RequireAtLeastOne<UserPropsToUpdate>): Promise<User | undefined>;
	updateById(id: number, params: RequireAtLeastOne<UserPropsToUpdate>): Promise<User | undefined>;
	delete(user: User): Promise<User | undefined>;
}

/**Represents the properties which will be updated  */
export type UserPropsToUpdate = {
	fullName: string;
	email: string;
	phoneNumber: string;
	activated: boolean;
};
