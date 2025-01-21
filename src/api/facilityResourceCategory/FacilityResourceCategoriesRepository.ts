import type { SimplePaginationParams } from "@common/types";
import { db } from "@db/index";
import { handleDBErrors } from "@db/utils";
import type { FacilityResourceCategory } from "./types";

export interface IFacilityResourceCategoriesRepository {
	getAll(params: SimplePaginationParams): Promise<FacilityResourceCategory[]>;
	store(name: string): Promise<FacilityResourceCategory>;
	update(id: number, props: { name: string }): Promise<FacilityResourceCategory>;
	delete(id: number): Promise<void>;
}

export class DBFacilityResourceCategoriesRepository
	implements IFacilityResourceCategoriesRepository
{
	update(id: number, props: { name: string }): Promise<FacilityResourceCategory> {
		return db
			.updateTable("facility_resource_categories")
			.where("id", "=", id)
			.set("name", props.name)
			.returningAll()
			.executeTakeFirstOrThrow()
			.catch(handleDBErrors);
	}

	async getAll(params: SimplePaginationParams): Promise<FacilityResourceCategory[]> {
		return await db.transaction().execute(async (transaction) => {
			return await transaction
				.selectFrom("facility_resource_categories")
				.orderBy("id", "asc")
				.limit(params.perPage)
				.$if(params.from != null, (qb) => qb.where("id", ">=", params.from))
				.selectAll()
				.execute();
		});
	}
	store(name: string): Promise<FacilityResourceCategory> {
		return db
			.insertInto("facility_resource_categories")
			.values({ name })
			.returningAll()
			.executeTakeFirstOrThrow()
			.catch(handleDBErrors);
	}
	async delete(id: number): Promise<void> {
		await db
			.deleteFrom("facility_resource_categories")
			.where("id", "=", id)
			.executeTakeFirstOrThrow();
	}
}
