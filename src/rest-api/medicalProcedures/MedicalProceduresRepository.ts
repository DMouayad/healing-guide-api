import type { SimplePaginationParams } from "src/common/types";
import { db } from "src/db/index";
import { handleDBErrors } from "src/db/utils";
import type { MedicalProcedure } from "./types";

export interface IMedicalProceduresRepository {
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
			.catch(handleDBErrors);
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
			.catch(handleDBErrors);
	}
	async delete(id: number): Promise<void> {
		await db
			.deleteFrom("medical_procedures")
			.where("id", "=", id)
			.executeTakeFirstOrThrow();
	}
}
