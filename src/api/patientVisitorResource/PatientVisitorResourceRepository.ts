import { db } from "@/db";
import {
	type CreatePatientVisitorResourceDTO,
	type PatientVisitorResource,
	type UpdatePatientVisitorResourceDTO,
	ZodPatientVisitorResourceStatus,
} from "./types";

export interface IPatientVisitorResourceRepository {
	getByFacilityId(facilityId: number): Promise<PatientVisitorResource[]>;
	getById(id: number): Promise<PatientVisitorResource | undefined>;
	getByIdAndFacilityId(
		id: number,
		facilityId: number,
	): Promise<PatientVisitorResource | undefined>;
	getItemsByUserId(userId: number): Promise<PatientVisitorResource[]>;
	getItemByIdAndUserId(
		id: number,
		userId: number,
	): Promise<PatientVisitorResource | undefined>;
	createForUser(dto: CreatePatientVisitorResourceDTO): Promise<PatientVisitorResource>;
	updateForUser(
		id: number,
		dto: UpdatePatientVisitorResourceDTO,
	): Promise<PatientVisitorResource | undefined>;
	deleteForUser(id: number, userId: number): Promise<void>;
}

type KyselyPatientVisitorResource = {
	id: number;
	category_id: number;
	facility_id: number;
	title: string;
	content: string;
	summary: string | null;
	created_at: Date;
	updated_at: Date;
	published_at: Date | null;
	status: string;
};
export class DBPatientVisitorResourceRepository
	implements IPatientVisitorResourceRepository
{
	fromQueryResults(results?: KyselyPatientVisitorResource[]): PatientVisitorResource[] {
		const newResults: PatientVisitorResource[] = [];
		if (!results) return newResults;
		for (const el of results) {
			const converted = this.fromQueryResult(el);
			if (converted) {
				newResults.push(converted);
			}
		}
		return newResults;
	}
	fromQueryResult(
		result?: KyselyPatientVisitorResource,
	): PatientVisitorResource | undefined {
		if (result) {
			return {
				categoryId: result.category_id,
				content: result.content,
				facilityId: result.facility_id,
				id: result.id,
				title: result.title,
				summary: result.summary,
				createdAt: result.created_at,
				updatedAt: result.updated_at,
				publishedAt: result.published_at,
				status:
					ZodPatientVisitorResourceStatus.safeParse(result.status).data ?? "pending",
			};
		}
	}

	getByIdAndFacilityId(
		id: number,
		facilityId: number,
	): Promise<PatientVisitorResource | undefined> {
		return db
			.selectFrom("facility_patient_visitor_resources")
			.selectAll()
			.where("id", "=", id)
			.where("facility_id", "=", facilityId)
			.executeTakeFirst()
			.then(this.fromQueryResult);
	}
	getItemsByUserId(userId: number): Promise<PatientVisitorResource[]> {
		return db
			.selectFrom("facility_patient_visitor_resources")
			.innerJoin(
				"medical_facilities as md",
				"md.id",
				"facility_patient_visitor_resources.facility_id",
			)
			.where("md.manager_id", "=", userId)
			.whereRef("facility_patient_visitor_resources.facility_id", "=", "md.id")
			.selectAll("facility_patient_visitor_resources")
			.execute()
			.then(this.fromQueryResults);
	}
	getItemByIdAndUserId(
		id: number,
		userId: number,
	): Promise<PatientVisitorResource | undefined> {
		return db
			.selectFrom("facility_patient_visitor_resources")
			.innerJoin(
				"medical_facilities as md",
				"md.id",
				"facility_patient_visitor_resources.facility_id",
			)
			.where("md.manager_id", "=", userId)
			.where("facility_patient_visitor_resources.id", "=", id)
			.selectAll("facility_patient_visitor_resources")
			.executeTakeFirst()
			.then(this.fromQueryResult);
	}
	createForUser(dto: CreatePatientVisitorResourceDTO): Promise<PatientVisitorResource> {
		return db
			.insertInto("facility_patient_visitor_resources")
			.values({
				category_id: dto.categoryId,
				content: dto.content,
				title: dto.title,
				facility_id: dto.facilityId,
				status: dto.status,
				summary: dto.summary,
				published_at: dto.status === "published" ? new Date() : null,
			})
			.returningAll()
			.executeTakeFirstOrThrow()
			.then((res) => this.fromQueryResult(res)!);
	}
	updateForUser(
		id: number,
		dto: UpdatePatientVisitorResourceDTO,
	): Promise<PatientVisitorResource | undefined> {
		return db
			.updateTable("facility_patient_visitor_resources")
			.$if(dto.content != null, (qb) => qb.set("content", dto.content!))
			.$if(dto.title != null, (qb) => qb.set("title", dto.title!))
			.$if(dto.summary != null, (qb) => qb.set("summary", dto.summary!))
			.$if(dto.status != null, (qb) => qb.set("status", dto.status!))
			.$if(dto.status === "published", (qb) => qb.set("published_at", new Date()))
			.set("updated_at", new Date())
			.where("id", "=", id)
			.returningAll()
			.executeTakeFirst()
			.then(this.fromQueryResult);
	}
	async deleteForUser(id: number, userId: number): Promise<void> {
		await db
			.deleteFrom("facility_patient_visitor_resources")
			.innerJoin(
				"medical_facilities as md",
				"md.id",
				"facility_patient_visitor_resources.facility_id",
			)
			.where("id", "=", id)
			.where("md.manager_id", "=", userId)
			.execute();
	}
	async getByFacilityId(facilityId: number): Promise<PatientVisitorResource[]> {
		return db
			.selectFrom("facility_patient_visitor_resources")
			.selectAll()
			.where("facility_id", "=", facilityId)
			.execute()
			.then(this.fromQueryResults);
	}

	async getById(id: number): Promise<PatientVisitorResource | undefined> {
		return db
			.selectFrom("facility_patient_visitor_resources")
			.selectAll()
			.where("id", "=", id)
			.executeTakeFirst()
			.then(this.fromQueryResult);
	}
}
