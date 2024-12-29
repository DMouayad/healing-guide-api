import { db } from "@/db";
import { handleDBErrors } from "@/db/utils";
import type { Expression } from "kysely";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import { objectToCamel, objectToSnake } from "ts-case-convert";
import type { ObjectToSnake } from "ts-case-convert/lib/caseConvert";
import type {
	CreatePhysicianDTO,
	Physician,
	PhysicianWithRelations,
	UpdatePhysicianDTO,
} from "./physician.types";

export interface IPhysicianRepository {
	getWithRelations(id: number): Promise<PhysicianWithRelations | undefined>;
	store(dto: CreatePhysicianDTO): Promise<Physician>;
	update(id: number, dto: UpdatePhysicianDTO): Promise<Physician>;
	deleteWhereUserId(userId: number): Promise<void>;
}

export class DBPhysicianRepository implements IPhysicianRepository {
	getWithRelations(id: number): Promise<PhysicianWithRelations | undefined> {
		return getPhysician(id, {
			conditions: true,
			procedures: true,
			specialties: true,
		});
	}
	store(dto: CreatePhysicianDTO): Promise<PhysicianWithRelations> {
		const relations = dto.relations;
		dto.relations = undefined;
		return db
			.insertInto("physicians")
			.values(objectToSnake(dto))
			.returningAll()
			.executeTakeFirstOrThrow()
			.catch(handleDBErrors)
			.then(objectToCamel)
			.then((physician) =>
				this.storePhysicianSpecialties(physician, relations?.specialties),
			)
			.then((physician) =>
				this.storePhysicianTreatConditions(physician, relations?.treatConditions),
			)
			.then((physician) =>
				this.storePhysicianProvideProcedures(physician, relations?.provideProcedures),
			);
	}
	update(id: number, dto: UpdatePhysicianDTO): Promise<Physician> {
		return db
			.updateTable("physicians")
			.where("id", "=", id)
			.$if(dto.biography != null, (qb) => qb.set("biography", dto.biography!))
			.$if(dto.fullName != null, (qb) => qb.set("full_name", dto.fullName!))
			.$if(dto.dateOfBirth != null, (qb) => qb.set("date_of_birth", dto.dateOfBirth!))
			.$if(dto.isMale != null, (qb) => qb.set("is_male", dto.isMale!))
			.$if(dto.phoneNumber != null, (qb) => qb.set("phone_number", dto.phoneNumber!))
			.$if(dto.mobilePhoneNumber != null, (qb) =>
				qb.set("mobile_phone_number", dto.mobilePhoneNumber!),
			)
			.$if(dto.pictureUrl != null, (qb) => qb.set("picture_url", dto.pictureUrl!))
			.returningAll()
			.executeTakeFirstOrThrow()
			.then(objectToCamel);
	}
	async deleteWhereUserId(userId: number): Promise<void> {
		await db.deleteFrom("physicians").where("user_id", "=", userId).execute();
	}

	handleDBErrors(err: any) {
		if (err instanceof PgDatabaseError) {
			switch (err.code) {
				case PG_ERR_CODE.DUPLICATE_VALUE:
					return Promise.reject(AppError.RESOURCE_ALREADY_EXISTS());
			}
		}
		return Promise.reject(err);
	}

	storePhysicianSpecialties(
		physician: Physician,
		specialties?: { id: number; name: string | null }[],
	) {
		if (!specialties || specialties?.length === 0) {
			return { ...physician, specialties: [] };
		}
		const values = specialties.map((el) => {
			return {
				specialty_id: el.id,
				physician_id: physician.id,
			};
		});
		return db
			.insertInto("physicians_specialties")
			.values(values)
			.onConflict((oc) => oc.constraint("physicians_specialties_PK").doNothing())
			.returning(["specialty_id"])
			.execute()
			.then((ids) => {
				const idsList = ids.flatMap((el) => el.specialty_id);
				const physicianSpecialties = specialties.filter((item) =>
					idsList.includes(item.id),
				);
				return { ...physician, specialties: physicianSpecialties };
			});
	}
	storePhysicianTreatConditions(physician: Physician, conditions?: { id: number }[]) {
		if (!conditions || conditions?.length === 0) {
			return { ...physician, treatConditions: [] };
		}
		const values = conditions.map((el) => {
			return {
				condition_id: el.id,
				physician_id: physician.id,
			};
		});
		return db
			.insertInto("physicians_treat_conditions")
			.values(values)
			.returning(["condition_id"])
			.onConflict((oc) => oc.constraint("physicians_treat_conditions_PK").doNothing())
			.execute()
			.then((ids) => {
				const idsList = ids.flatMap((el) => el.condition_id);
				const treatConditions = conditions.filter((item) => idsList.includes(item.id));
				return { ...physician, treatConditions };
			});
	}
	storePhysicianProvideProcedures(physician: Physician, procedures?: { id: number }[]) {
		if (!procedures || procedures?.length === 0) {
			return { ...physician, provideProcedures: [] };
		}
		const values = procedures.map((el) => {
			return {
				procedure_id: el.id,
				physician_id: physician.id,
			};
		});
		return db
			.insertInto("physicians_provided_procedures")
			.values(values)
			.returning(["procedure_id"])
			.onConflict((oc) =>
				oc.constraint("physicians_provided_procedures_PK").doNothing(),
			)
			.execute()
			.then((ids) => {
				const idsList = ids.flatMap((el) => el.procedure_id);

				const provideProcedures = procedures.filter((item) =>
					idsList.includes(item.id),
				);
				return { ...physician, provideProcedures };
			});
	}
}
function getPhysician(
	id: number,
	includeRelations: {
		conditions: boolean;
		procedures: boolean;
		specialties: boolean;
	},
) {
	return (
		db
			.selectFrom("physicians")
			.selectAll()
			.where("id", "=", id)
			.$if(includeRelations.conditions, (qb) =>
				qb.select((eb) =>
					physician_treat_conditions(eb.ref("physicians.id"))
						.$notNull()
						.as("treat_conditions"),
				),
			)
			.$if(includeRelations.procedures, (qb) =>
				qb.select((eb) =>
					physician_provide_procedures(eb.ref("physicians.id"))
						.$notNull()
						.as("provide_procedures"),
				),
			)
			.$if(includeRelations.specialties, (qb) =>
				qb.select((eb) =>
					physician_specialties(eb.ref("physicians.id")).$notNull().as("specialties"),
				),
			)
			.executeTakeFirst()
			//@ts-ignore
			.then(preparePhysicianObj)
	);
}
function preparePhysicianObj(physician?: ObjectToSnake<PhysicianWithRelations>) {
	if (physician) {
		const physicianCamelCase = objectToCamel(physician);
		if (physicianCamelCase.treatConditions == null) {
			physicianCamelCase.treatConditions = [];
		}
		if (physicianCamelCase.provideProcedures == null) {
			physicianCamelCase.provideProcedures = [];
		}
		if (physicianCamelCase.specialties == null) {
			physicianCamelCase.specialties = [];
		}
		return physicianCamelCase;
	}
}

function physician_treat_conditions(physicianId: Expression<number>) {
	return jsonArrayFrom(
		db
			.selectFrom("physicians_treat_conditions")
			.select("condition_id as id")
			.select((eb) =>
				eb
					.selectFrom("medical_conditions")
					.select("medical_conditions.name")
					.whereRef(
						"physicians_treat_conditions.condition_id",
						"=",
						"medical_conditions.id",
					)
					.limit(1)
					.as("name"),
			)
			.where("physician_id", "=", physicianId),
	);
}
function physician_specialties(physicianId: Expression<number>) {
	return jsonArrayFrom(
		db
			.selectFrom("physicians_specialties")
			.select("specialty_id as id")
			.select((eb) =>
				eb
					.selectFrom("medical_specialties")
					.select("medical_specialties.name")
					.whereRef(
						"physicians_specialties.specialty_id",
						"=",
						"medical_specialties.id",
					)
					.limit(1)
					.as("name"),
			)
			.where("physician_id", "=", physicianId),
	);
}
function physician_provide_procedures(physicianId: Expression<number>) {
	return jsonArrayFrom(
		db
			.selectFrom("physicians_provided_procedures")
			.select("procedure_id as id")
			.select((eb) =>
				eb
					.selectFrom("medical_procedures")
					.select("medical_procedures.name")
					.whereRef(
						"physicians_provided_procedures.procedure_id",
						"=",
						"medical_procedures.id",
					)
					.limit(1)
					.as("name"),
			)
			.where("physician_id", "=", physicianId),
	);
}
