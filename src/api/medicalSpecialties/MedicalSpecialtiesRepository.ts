import type { SimplePaginationParams } from "@common/types";
import { db } from "@db/index";
import { handleDBErrors } from "@db/utils";
import type { MedicalSpecialty } from "./types";

export interface IMedicalSpecialtiesRepository {
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
			.catch(handleDBErrors);
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
			.catch(handleDBErrors);
	}
	async delete(id: number): Promise<void> {
		await db
			.deleteFrom("medical_specialties")
			.where("id", "=", id)
			.executeTakeFirstOrThrow();
	}
}
