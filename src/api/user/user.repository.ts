import { APP_ROLES, type RequireAtLeastOne, type Role } from "@/common/types";
import { db } from "@/db";
import type { IUserRepository, UserPropsToUpdate } from "@/interfaces/IUserRepository";
import { DBUser } from "./user.model";

export class DBUserRepository implements IUserRepository<DBUser> {
	async updateById(
		id: number,
		props: RequireAtLeastOne<UserPropsToUpdate>,
	): Promise<DBUser | undefined> {
		const query = db
			.updateTable("users")
			.$if(props.fullName !== undefined, (qb) => qb.set("full_name", props.fullName!))
			.$if(props.email !== undefined, (qb) => qb.set("email", props.email!))
			.$if(props.phoneNumber !== undefined, (qb) => qb.set("phone_number", props.phoneNumber!))
			.$if(props.activated !== undefined, (qb) => qb.set("activated", props.activated!))
			.where("id", "=", id);

		return query
			.returningAll()
			.executeTakeFirst()
			.then((result) => DBUser.fromQueryResult(result));
	}
	async getWithRoles(roles: Role[]): Promise<DBUser[]> {
		const roleIds = Object.values(APP_ROLES)
			.filter((v) => roles.includes(v))
			.map((role) => Number.parseInt(role.roleId));
		const users = await db
			.selectFrom("users")
			.selectAll()
			.where("role_id", "in", roleIds)
			.execute();
		return users.flatMap((queryUser) => {
			const dbUser = DBUser.fromQueryResult(queryUser);
			if (dbUser) {
				return dbUser;
			}
			return [];
		});
	}
	async find(id: number): Promise<DBUser | undefined> {
		const query = db.selectFrom("users").selectAll("users").where("id", "=", id);
		return query.executeTakeFirst().then((result) => DBUser.fromQueryResult(result));
	}

	async delete(user: DBUser): Promise<DBUser | undefined> {
		return db
			.deleteFrom("users")
			.where("id", "=", user.id)
			.returningAll()
			.executeTakeFirst()
			.then((result) => DBUser.fromQueryResult(result));
	}

	async update(
		user: DBUser,
		props: RequireAtLeastOne<UserPropsToUpdate>,
	): Promise<DBUser | undefined> {
		return await this.updateById(user.id, props);
	}
}
