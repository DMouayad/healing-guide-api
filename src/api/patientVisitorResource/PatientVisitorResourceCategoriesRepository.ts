import type { SimplePaginationParams } from "@common/types";
import { db } from "@db/index";
import { handleDBErrors } from "@db/utils";
import { objectToCamel } from "ts-case-convert";
import type {
	CreatePatientVisitorResourceCategoryDTO,
	PatientVisitorResourceCategory,
	UpdatePatientVisitorResourceCategoryDTO,
} from "./types";

export interface IPatientVisitorResourceCategoriesRepository {
	getAll(params: SimplePaginationParams): Promise<PatientVisitorResourceCategory[]>;
	store(
		data: CreatePatientVisitorResourceCategoryDTO,
	): Promise<PatientVisitorResourceCategory>;
	update(
		id: number,
		data: UpdatePatientVisitorResourceCategoryDTO,
	): Promise<PatientVisitorResourceCategory>;
	delete(id: number): Promise<void>;
}

export class DBPatientVisitorResourceCategoriesRepository
	implements IPatientVisitorResourceCategoriesRepository
{
	async getAll(
		params: SimplePaginationParams,
	): Promise<PatientVisitorResourceCategory[]> {
		return db
			.selectFrom("patient_visitor_resource_categories")
			.orderBy("id", "asc")
			.limit(params.perPage)
			.$if(params.from != null, (qb) => qb.where("id", ">=", params.from))
			.selectAll()
			.execute()
			.then((results) => (results ? results.map(objectToCamel) : []));
	}

	store(
		data: CreatePatientVisitorResourceCategoryDTO,
	): Promise<PatientVisitorResourceCategory> {
		return db
			.insertInto("patient_visitor_resource_categories")
			.values({
				name: data.name,
				description: data.description,
				icon_name: data.iconName,
			})
			.returningAll()
			.executeTakeFirstOrThrow()
			.catch(handleDBErrors);
	}

	update(
		id: number,
		data: UpdatePatientVisitorResourceCategoryDTO,
	): Promise<PatientVisitorResourceCategory> {
		return db
			.updateTable("patient_visitor_resource_categories")
			.where("id", "=", id)
			.set(data)
			.returningAll()
			.executeTakeFirstOrThrow()
			.catch(handleDBErrors)
			.then(objectToCamel);
	}

	async delete(id: number): Promise<void> {
		await db
			.deleteFrom("patient_visitor_resource_categories")
			.where("id", "=", id)
			.execute();
	}
}
