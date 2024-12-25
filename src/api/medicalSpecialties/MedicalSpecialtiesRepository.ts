import { PG_ERR_CODE } from "@/common/constants";
import AppError from "@/common/models/appError";
import type { SimplePaginationParams } from "@/common/types";
import { db } from "@/db";
import { DatabaseError as PgDatabaseError } from "pg";
import type { MedicalSpecialty } from "./types";

export interface IMedicalSpecialtiesRepository {
	getById(id: number): Promise<MedicalSpecialty | undefined>;
	getAll(params: SimplePaginationParams): Promise<MedicalSpecialty[]>;
	store(name: string): Promise<MedicalSpecialty>;
	update(id: number, props: { name: string }): Promise<MedicalSpecialty>;
	delete(id: number): Promise<void>;
}

export class DBMedicalSpecialtiesRepository implements IMedicalSpecialtiesRepository {
	update(id: number, props: { name: string }): Promise<MedicalSpecialty> {
		return db
			.updateTable("medical_specialties")
			.where("id", "=", id)
			.set("name", props.name)
			.returningAll()
			.executeTakeFirstOrThrow()
			.catch(this.handleDBErrors);
	}
	getById(id: number): Promise<MedicalSpecialty | undefined> {
		return db
			.selectFrom("medical_specialties")
			.selectAll()
			.where("id", "=", id)
			.executeTakeFirst();
	}
	async getAll(params: SimplePaginationParams): Promise<MedicalSpecialty[]> {
		return await db.transaction().execute(async (transaction) => {
			return await transaction
				.selectFrom("medical_specialties")
				.orderBy("id", "asc")
				.limit(params.perPage)
				.$if(params.from != null, (qb) => qb.where("id", ">=", params.from))
				.selectAll()
				.execute();
		});
	}
	store(name: string): Promise<MedicalSpecialty> {
		return db
			.insertInto("medical_specialties")
			.values({ name })
			.returningAll()
			.executeTakeFirstOrThrow()
			.catch(this.handleDBErrors);
	}
	async delete(id: number): Promise<void> {
		await db
			.deleteFrom("medical_specialties")
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
