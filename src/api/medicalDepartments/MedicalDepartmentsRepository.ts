import { PG_ERR_CODE } from "@/common/constants";
import AppError from "@/common/models/appError";
import type { SimplePaginationParams } from "@/common/types";
import { db } from "@/db";
import { DatabaseError as PgDatabaseError } from "pg";
import type { MedicalDepartment } from "./types";

export interface IMedicalDepartmentsRepository {
	getById(id: string): Promise<MedicalDepartment | undefined>;
	getAll(params: SimplePaginationParams): Promise<MedicalDepartment[]>;
	store(name: string): Promise<MedicalDepartment>;
	update(id: string, props: { name: string }): Promise<MedicalDepartment>;
	delete(id: string): Promise<void>;
}

export class DBMedicalDepartmentsRepository implements IMedicalDepartmentsRepository {
	update(id: string, props: { name: string }): Promise<MedicalDepartment> {
		return db
			.updateTable("medical_departments")
			.where("id", "=", id)
			.set("name", props.name)
			.returningAll()
			.executeTakeFirstOrThrow()
			.catch(this.handleDBErrors);
	}
	getById(id: string): Promise<MedicalDepartment | undefined> {
		return db
			.selectFrom("medical_departments")
			.selectAll()
			.where("id", "=", id)
			.executeTakeFirst();
	}
	async getAll(params: SimplePaginationParams): Promise<MedicalDepartment[]> {
		return await db.transaction().execute(async (transaction) => {
			return await transaction
				.selectFrom("medical_departments")
				.orderBy("id", "asc")
				.limit(params.perPage)
				.$if(params.from != null, (qb) => qb.where("id", ">=", params.from.toString()!))
				.selectAll()
				.execute();
		});
	}
	store(name: string): Promise<MedicalDepartment> {
		return db
			.insertInto("medical_departments")
			.values({ name })
			.returningAll()
			.executeTakeFirstOrThrow()
			.catch(this.handleDBErrors);
	}
	async delete(id: string): Promise<void> {
		await db
			.deleteFrom("medical_departments")
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
