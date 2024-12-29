import type { SimplePaginationParams } from "@/common/types";
import { db } from "@/db";
import { handleDBErrors } from "@/db/utils";
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
			.catch(handleDBErrors);
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
			.catch(handleDBErrors);
	}
	async delete(id: number): Promise<void> {
		await db
			.deleteFrom("medical_conditions")
			.where("id", "=", id)
			.executeTakeFirstOrThrow();
	}
}
