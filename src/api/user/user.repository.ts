import { PG_ERR_CODE } from "@/common/constants";
import AppError from "@/common/models/appError";
import { APP_ROLES, type Role } from "@/common/types";
import { db } from "@/db";
import type { CreateUserDTO, UpdateUserDTO } from "@/interfaces/IUser";
import type { IUserRepository } from "@/interfaces/IUserRepository";
import { DatabaseError as PgDatabaseError } from "pg";
import { DBUser } from "./user.model";

export class DBUserRepository implements IUserRepository<DBUser> {
	async verifyCredentialsAreUnique(
		phoneNumber?: string,
		email?: string,
	): Promise<boolean> {
		const result = await db
			.selectFrom("users")
			.$if(email != null, (qb) => qb.where("email", "=", email!))
			.$if(phoneNumber != null, (qb) => qb.where("phone_number", "=", phoneNumber!))
			.select(({ fn }) => fn.countAll<number>().as("matching_users"))
			.executeTakeFirst();
		return result ? result?.matching_users === 0 : false;
	}
	async findByEmailOrPhoneNumber(emailOrPhoneNo: string): Promise<DBUser | undefined> {
		const query = db
			.selectFrom("users")
			.selectAll("users")
			.where((eb) =>
				eb.or([
					eb("email", "=", emailOrPhoneNo),
					eb("phone_number", "=", emailOrPhoneNo),
				]),
			);
		return query.executeTakeFirst().then((result) => DBUser.fromQueryResult(result));
	}
	async create(dto: CreateUserDTO): Promise<DBUser | undefined> {
		const insertStmt = db
			.insertInto("users")
			.values({
				email: dto.email,
				phone_number: dto.phoneNumber,
				password_hash: dto.passwordHash,
				role_id: dto.role.roleId,
				activated: dto.activated,
				identity_confirmed_at: dto.identityConfirmedAt,
			})
			.returningAll();

		return insertStmt
			.executeTakeFirst()
			.then((result) => DBUser.fromQueryResult(result))
			.catch(this.handleDBErrors);
	}
	handleDBErrors(err: any) {
		if (err instanceof PgDatabaseError) {
			switch (err.code) {
				case PG_ERR_CODE.DUPLICATE_VALUE:
					return Promise.reject(AppError.ACCOUNT_ALREADY_EXISTS());
			}
		}
		return Promise.reject(err);
	}
	//
	async updateById(id: number, props: UpdateUserDTO): Promise<DBUser | undefined> {
		const query = db
			.updateTable("users")
			.$if(props.email !== undefined, (qb) => qb.set("email", props.email!))
			.$if(props.phoneNumber !== undefined, (qb) =>
				qb.set("phone_number", props.phoneNumber!),
			)
			.$if(props.activated !== undefined, (qb) => qb.set("activated", props.activated!))
			.$if(props.emailVerifiedAt !== undefined, (qb) =>
				qb.set("email_verified_at", props.emailVerifiedAt!),
			)
			.$if(props.phoneNumberVerifiedAt !== undefined, (qb) =>
				qb.set("phone_number_verified_at", props.phoneNumberVerifiedAt!),
			)
			.$if(props.identityConfirmedAt !== undefined, (qb) =>
				qb.set("identity_confirmed_at", props.identityConfirmedAt!),
			)
			.where("id", "=", id);

		return query
			.returningAll()
			.executeTakeFirst()
			.catch(this.handleDBErrors)
			.then((result) => DBUser.fromQueryResult(result));
	}
	async getWithRoles(roles: Role[]): Promise<DBUser[]> {
		const roleIds = Object.values(APP_ROLES)
			.filter((v) => roles.includes(v))
			.map((role) => role.roleId);
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

	async update(user: DBUser, props: UpdateUserDTO): Promise<DBUser | undefined> {
		return await this.updateById(user.id, props);
	}
}
