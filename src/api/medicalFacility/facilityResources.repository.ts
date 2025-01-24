import { db } from "@/db";
import { objectToCamel } from "ts-case-convert";
import type {
	CreateFacilityResourceDTO,
	FacilityResource,
	UpdateFacilityResourceDTO,
} from "./facilityResources.types";

export interface IFacilityResourcesRepository {
	getByFacilityId(facilityId: number): Promise<FacilityResource[]>;
	getById(id: number): Promise<FacilityResource | undefined>;
	create(dto: CreateFacilityResourceDTO): Promise<FacilityResource>;
	update(
		id: number,
		dto: UpdateFacilityResourceDTO,
	): Promise<FacilityResource | undefined>;
	delete(id: number): Promise<void>;
}

export class DBFacilityResourcesRepository implements IFacilityResourcesRepository {
	async getByFacilityId(facilityId: number): Promise<FacilityResource[]> {
		return db
			.selectFrom("facility_resources")
			.selectAll()
			.where("facility_id", "=", facilityId)
			.execute()
			.then((results) => (results ? results.map(objectToCamel) : []));
	}

	async getById(id: number): Promise<FacilityResource | undefined> {
		return db
			.selectFrom("facility_resources")
			.selectAll()
			.where("id", "=", id)
			.executeTakeFirst()
			.then((result) => (result ? objectToCamel(result) : undefined));
	}

	async create(dto: CreateFacilityResourceDTO): Promise<FacilityResource> {
		return await db
			.insertInto("facility_resources")
			.values({
				category_id: dto.categoryId,
				content: dto.content,
				facility_id: dto.facilityId,
				title: dto.title,
			})
			.returningAll()
			.executeTakeFirstOrThrow()
			.then(objectToCamel);
	}

	async update(
		id: number,
		dto: UpdateFacilityResourceDTO,
	): Promise<FacilityResource | undefined> {
		return db
			.updateTable("facility_resources")
			.set(dto)
			.where("id", "=", id)
			.returningAll()
			.executeTakeFirst()
			.then((result) => (result ? objectToCamel(result) : undefined));
	}

	async delete(id: number): Promise<void> {
		await db.deleteFrom("facility_resources").where("id", "=", id).execute();
	}
}
