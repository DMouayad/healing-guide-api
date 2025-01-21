import type { SimplePaginationParams } from "@common/types";
import { db } from "@db/index";
import { handleDBErrors } from "@db/utils";
import type { FacilityType } from "./types";

export interface IFacilityTypesRepository {
	getAll(params: SimplePaginationParams): Promise<FacilityType[]>;
	store(name: string): Promise<FacilityType>;
	update(id: number, props: { name: string }): Promise<FacilityType>;
	delete(id: number): Promise<void>;
}

export class DBFacilityTypesRepository implements IFacilityTypesRepository {
	update(id: number, props: { name: string }): Promise<FacilityType> {
		return db
			.updateTable("facility_types")
			.where("id", "=", id)
			.set("name", props.name)
			.returningAll()
			.executeTakeFirstOrThrow()
			.catch(handleDBErrors);
	}

	async getAll(params: SimplePaginationParams): Promise<FacilityType[]> {
		return await db.transaction().execute(async (transaction) => {
			return await transaction
				.selectFrom("facility_types")
				.orderBy("id", "asc")
				.limit(params.perPage)
				.$if(params.from != null, (qb) => qb.where("id", ">=", params.from))
				.selectAll()
				.execute();
		});
	}
	store(name: string): Promise<FacilityType> {
		return db
			.insertInto("facility_types")
			.values({ name })
			.returningAll()
			.executeTakeFirstOrThrow()
			.catch(handleDBErrors);
	}
	async delete(id: number): Promise<void> {
		await db
			.deleteFrom("facility_types")
			.where("id", "=", id)
			.executeTakeFirstOrThrow();
	}
}
