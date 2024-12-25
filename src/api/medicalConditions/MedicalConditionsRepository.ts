import { PG_ERR_CODE } from "@/common/constants";
import AppError from "@/common/models/appError";
import type { SimplePaginationParams } from "@/common/types";
import { db } from "@/db";
import { DatabaseError as PgDatabaseError } from "pg";
import type { MedicalCondition } from "./types";

export interface IMedicalConditionsRepository {
	getById(id: number): Promise<MedicalCondition | undefined>;
	getAll(params: SimplePaginationParams): Promise<MedicalCondition[]>;
	store(name: string): Promise<MedicalCondition>;
	update(id: number, props: { name: string }): Promise<MedicalCondition>;
	delete(id: number): Promise<void>;
}

export class DBMedicalConditionsRepository implements IMedicalConditionsRepository {
	update(id: number, props: { name: string }): Promise<MedicalCondition> {
		return db
			.updateTable("medical_conditions")
			.where("id", "=", id)
			.set("name", props.name)
			.returningAll()
			.executeTakeFirstOrThrow()
			.catch(this.handleDBErrors);
	}
	getById(id: number): Promise<MedicalCondition | undefined> {
		return db
			.selectFrom("medical_conditions")
			.selectAll()
			.where("id", "=", id)
			.executeTakeFirst();
	}
	async getAll(params: SimplePaginationParams): Promise<MedicalCondition[]> {
		return await db.transaction().execute(async (transaction) => {
			return await transaction
				.selectFrom("medical_conditions")
				.orderBy("id", "asc")
				.limit(params.perPage)
				.$if(params.from != null, (qb) => qb.where("id", ">=", params.from))
				.selectAll()
				.execute();
		});
	}
	store(name: string): Promise<MedicalCondition> {
		return db
			.insertInto("medical_conditions")
			.values({ name })
			.returningAll()
			.executeTakeFirstOrThrow()
			.catch(this.handleDBErrors);
	}
	async delete(id: number): Promise<void> {
		await db
			.deleteFrom("medical_conditions")
			.where("id", "=", id)
			.executeTakeFirstOrThrow();
	}
	handleDBErrors(err: any) {
		if (err instanceof PgDatabaseError) {
			switch (err.code) {
				case PG_ERR_CODE.DUPLICATE_VALUE:
					return Promise.reject(AppError.RESOURCE_ALREADY_EXISTS());
			}
		}
		return Promise.reject(err);
	}
}
