import { db } from "@/db";
import type { IUser } from "@/interfaces/IUser";
import { objectToCamel } from "ts-case-convert";
import type { MedicalFacility } from "./medicalFacility.types";

export interface IMedicalFacilityRepository {
	findByUser(user: IUser): Promise<MedicalFacility | undefined>;
}

export class DBMedicalFacilityRepository implements IMedicalFacilityRepository {
	async findByUser(user: IUser): Promise<MedicalFacility | undefined> {
		return db
			.selectFrom("medical_facilities")
			.selectAll()
			.where("manager_id", "=", user.id)
			.executeTakeFirst()
			.then((result) => (result ? objectToCamel(result) : undefined));
	}
}
