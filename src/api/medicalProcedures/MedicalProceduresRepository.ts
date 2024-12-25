import { PG_ERR_CODE } from "@/common/constants";
import AppError from "@/common/models/appError";
import type { SimplePaginationParams } from "@/common/types";
import { db } from "@/db";
import { DatabaseError as PgDatabaseError } from "pg";
import type { MedicalProcedure } from "./types";

export interface IMedicalProceduresRepository {
	getById(id: number): Promise<MedicalProcedure | undefined>;
	getAll(params: SimplePaginationParams): Promise<MedicalProcedure[]>;
	store(name: string): Promise<MedicalProcedure>;
	update(id: number, props: { name: string }): Promise<MedicalProcedure>;
	delete(id: number): Promise<void>;
}

export class DBMedicalProceduresRepository implements IMedicalProceduresRepository {
	update(id: number, props: { name: string }): Promise<MedicalProcedure> {
		return db
			.updateTable("medical_procedures")
			.where("id", "=", id)
			.set("name", props.name)
			.returningAll()
			.executeTakeFirstOrThrow()
			.catch(this.handleDBErrors);
	}
	getById(id: number): Promise<MedicalProcedure | undefined> {
		return db
			.selectFrom("medical_procedures")
			.selectAll()
			.where("id", "=", id)
			.executeTakeFirst();
	}
	async getAll(params: SimplePaginationParams): Promise<MedicalProcedure[]> {
		return await db.transaction().execute(async (transaction) => {
			return await transaction
				.selectFrom("medical_procedures")
				.orderBy("id", "asc")
				.limit(params.perPage)
				.$if(params.from != null, (qb) => qb.where("id", ">=", params.from))
				.selectAll()
				.execute();
		});
	}
	store(name: string): Promise<MedicalProcedure> {
		return db
			.insertInto("medical_procedures")
			.values({ name })
			.returningAll()
			.executeTakeFirstOrThrow()
			.catch(this.handleDBErrors);
	}
	async delete(id: number): Promise<void> {
		await db
			.deleteFrom("medical_procedures")
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
