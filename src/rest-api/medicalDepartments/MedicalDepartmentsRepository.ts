import type { SimplePaginationParams } from "src/common/types";
import { db } from "src/db/index";
import { handleDBErrors } from "src/db/utils";
import type { MedicalDepartment } from "./types";

export interface IMedicalDepartmentsRepository {
	getAll(params: SimplePaginationParams): Promise<MedicalDepartment[]>;
	store(name: string): Promise<MedicalDepartment>;
	update(id: number, props: { name: string }): Promise<MedicalDepartment>;
	delete(id: number): Promise<void>;
}

export class DBMedicalDepartmentsRepository implements IMedicalDepartmentsRepository {
	update(id: number, props: { name: string }): Promise<MedicalDepartment> {
		return db
			.updateTable("medical_departments")
			.where("id", "=", id)
			.set("name", props.name)
			.returningAll()
			.executeTakeFirstOrThrow()
			.catch(handleDBErrors);
	}
	async getAll(params: SimplePaginationParams): Promise<MedicalDepartment[]> {
		return await db.transaction().execute(async (transaction) => {
			return await transaction
				.selectFrom("medical_departments")
				.orderBy("id", "asc")
				.limit(params.perPage)
				.$if(params.from != null, (qb) => qb.where("id", ">=", params.from))
				.selectAll()
				.execute();
		});
	}
	store(name: string): Promise<MedicalDepartment> {
		return db
			.insertInto("medical_departments")
			.values({ name })
			.returningAll()
			.executeTakeFirstOrThrow()
			.catch(handleDBErrors);
	}
	async delete(id: number): Promise<void> {
		await db
			.deleteFrom("medical_departments")
			.where("id", "=", id)
			.executeTakeFirstOrThrow();
	}
}
