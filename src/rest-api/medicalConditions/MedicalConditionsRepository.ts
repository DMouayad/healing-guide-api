import type { SimplePaginationParams } from "src/common/types";
import { db } from "src/db/index";
import { handleDBErrors } from "src/db/utils";
import type { MedicalCondition } from "./types";

export interface IMedicalConditionsRepository {
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
			.catch(handleDBErrors);
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
			.catch(handleDBErrors);
	}
	async delete(id: number): Promise<void> {
		await db
			.deleteFrom("medical_conditions")
			.where("id", "=", id)
			.executeTakeFirstOrThrow();
	}
}
