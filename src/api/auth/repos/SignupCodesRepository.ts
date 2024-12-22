import { PG_ERR_CODE } from "@/common/constants";
import AppError from "@/common/models/appError";
import { db } from "@/db";
import { DatabaseError as PgDatabaseError } from "pg";
import { objectToCamel, objectToSnake } from "ts-case-convert";
import type { SignupCode } from "../auth.types";

export interface ISignupCodesRepository {
	find(params: { email?: string; phoneNumber: string }): Promise<
		SignupCode | undefined
	>;
	store(signupCode: SignupCode): Promise<SignupCode>;
}

export class DBSignupCodesRepository implements ISignupCodesRepository {
	async find(params: { email?: string; phoneNumber: string }): Promise<
		SignupCode | undefined
	> {
		return db
			.selectFrom("signup_codes")
			.selectAll()
			.where("phone_number", "=", params.phoneNumber)
			.$if(params.email != null, (qb) => qb.where("email", "=", params.email!))
			.executeTakeFirst()
			.then((result) => (result ? objectToCamel(result) : undefined));
	}
	async store(signupCode: SignupCode): Promise<SignupCode> {
		await db
			.deleteFrom("signup_codes")
			.where("phone_number", "=", signupCode.phoneNumber)
			.execute();
		return db
			.insertInto("signup_codes")
			.values(objectToSnake(signupCode))
			.returningAll()
			.executeTakeFirstOrThrow()
			.then(objectToCamel)
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
}
