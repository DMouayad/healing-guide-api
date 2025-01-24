import type { SimplePaginationParams } from "@common/types";
import { db } from "@db/index";
import { handleDBErrors } from "@db/utils";
import { objectToCamel } from "ts-case-convert";
import type {
	CreatePatientVisitorInfoCategoryDTO,
	PatientVisitorInfoCategory,
	UpdatePatientVisitorInfoCategoryDTO,
} from "./types";

export interface IPatientVisitorInfoCategoriesRepository {
	getAll(params: SimplePaginationParams): Promise<PatientVisitorInfoCategory[]>;
	store(data: CreatePatientVisitorInfoCategoryDTO): Promise<PatientVisitorInfoCategory>;
	update(
		id: number,
		data: UpdatePatientVisitorInfoCategoryDTO,
	): Promise<PatientVisitorInfoCategory>;
	delete(id: number): Promise<void>;
}

export class DBPatientVisitorInfoCategoriesRepository
	implements IPatientVisitorInfoCategoriesRepository
{
	async getAll(params: SimplePaginationParams): Promise<PatientVisitorInfoCategory[]> {
		return db
			.selectFrom("patient_visitor_info_categories")
			.orderBy("id", "asc")
			.limit(params.perPage)
			.$if(params.from != null, (qb) => qb.where("id", ">=", params.from))
			.selectAll()
			.execute()
			.then((results) => (results ? results.map(objectToCamel) : []));
	}

	store(
		data: CreatePatientVisitorInfoCategoryDTO,
	): Promise<PatientVisitorInfoCategory> {
		return db
			.insertInto("patient_visitor_info_categories")
			.values({
				name: data.name,
				desciption: data.description,
				icon_name: data.iconName,
			})
			.returningAll()
			.executeTakeFirstOrThrow()
			.catch(handleDBErrors);
	}

	update(
		id: number,
		data: UpdatePatientVisitorInfoCategoryDTO,
	): Promise<PatientVisitorInfoCategory> {
		return db
			.updateTable("patient_visitor_info_categories")
			.where("id", "=", id)
			.set(data)
			.returningAll()
			.executeTakeFirstOrThrow()
			.catch(handleDBErrors)
			.then(objectToCamel);
	}

	async delete(id: number): Promise<void> {
		await db
			.deleteFrom("patient_visitor_info_categories")
			.where("id", "=", id)
			.execute();
	}
}
