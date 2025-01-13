import AppError from "@common/models/appError";
import { db } from "@db/index";
import { handleDBErrors } from "@db/utils";
import type { Expression } from "kysely";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import { objectToCamel, objectToSnake } from "ts-case-convert";
import type { ObjectToSnake } from "ts-case-convert/lib/caseConvert";
import type { Language } from "../languages/language.types";
import type { MedicalCondition } from "../medicalConditions/types";
import type { MedicalProcedure } from "../medicalProcedures/types";
import type { MedicalSpecialty } from "../medicalSpecialties/types";
import type {
	CreatePhysicianDTO,
	Physician,
	PhysicianWithRelations,
	UpdatePhysicianDTO,
} from "./physician.types";

export interface IPhysicianRepository {
	getByUserId(userId: number): Promise<Physician | undefined>;
	getWithRelations(id: number): Promise<PhysicianWithRelations | undefined>;
	store(dto: CreatePhysicianDTO): Promise<Physician>;
	updateByUserId(userId: number, dto: UpdatePhysicianDTO): Promise<Physician>;
	deleteWhereUserId(userId: number): Promise<void>;
	setPhysicianLanguages(
		physicianId: number,
		languageIds: number[],
	): Promise<Language[]>;
	setPhysicianSpecialties(
		physicianId: number,
		specialtyIds: number[],
	): Promise<MedicalSpecialty[]>;
	setPhysicianProvidedProcedures(
		physicianId: number,
		procedureIds: number[],
	): Promise<MedicalProcedure[]>;

	setPhysicianTreatedConditions(
		physicianId: number,
		conditionIds: number[],
	): Promise<MedicalCondition[]>;
}

export class DBPhysicianRepository implements IPhysicianRepository {
	async setPhysicianLanguages(
		physicianId: number,
		languageIds: number[],
	): Promise<Language[]> {
		const values = languageIds.map((langId) => {
			return { language_id: langId, physician_id: physicianId };
		});
		return await db.transaction().execute(async (trx) => {
			await trx.deleteFrom("physicians_languages").execute();
			await trx
				.insertInto("physicians_languages")
				.values(values)
				.returningAll()
				.execute();
			return trx
				.selectFrom("languages")
				.selectAll()
				.where("id", "in", languageIds)
				.execute()
				.then(objectToCamel);
		});
	}
	async setPhysicianSpecialties(
		physicianId: number,
		specialtyIds: number[],
	): Promise<MedicalSpecialty[]> {
		const values = specialtyIds.map((langId) => {
			return { specialty_id: langId, physician_id: physicianId };
		});
		return await db.transaction().execute(async (trx) => {
			await trx.deleteFrom("physicians_specialties").execute();
			await trx
				.insertInto("physicians_specialties")
				.values(values)
				.returningAll()
				.execute();
			return trx
				.selectFrom("medical_specialties")
				.selectAll()
				.where("id", "in", specialtyIds)
				.execute()
				.then(objectToCamel);
		});
	}
	async setPhysicianProvidedProcedures(
		physicianId: number,
		procedureIds: number[],
	): Promise<MedicalProcedure[]> {
		const values = procedureIds.map((langId) => {
			return { procedure_id: langId, physician_id: physicianId };
		});
		return await db.transaction().execute(async (trx) => {
			await trx.deleteFrom("physicians_provided_procedures").execute();
			await trx
				.insertInto("physicians_provided_procedures")
				.values(values)
				.returningAll()
				.execute();
			return trx
				.selectFrom("medical_procedures")
				.selectAll()
				.where("id", "in", procedureIds)
				.execute()
				.then(objectToCamel);
		});
	}
	async setPhysicianTreatedConditions(
		physicianId: number,
		conditionIds: number[],
	): Promise<MedicalCondition[]> {
		const values = conditionIds.map((langId) => {
			return { condition_id: langId, physician_id: physicianId };
		});
		return await db.transaction().execute(async (trx) => {
			await trx.deleteFrom("physicians_treat_conditions").execute();
			await trx
				.insertInto("physicians_treat_conditions")
				.values(values)
				.returningAll()
				.execute();
			return trx
				.selectFrom("medical_conditions")
				.selectAll()
				.where("id", "in", conditionIds)
				.execute()
				.then(objectToCamel);
		});
	}

	getByUserId(userId: number): Promise<Physician | undefined> {
		return db
			.selectFrom("physicians")
			.where("user_id", "=", userId)
			.selectAll()
			.executeTakeFirst()
			.then((result) => (result ? objectToCamel(result) : undefined));
	}

	getWithRelations(id: number): Promise<PhysicianWithRelations | undefined> {
		return getPhysician(id, {
			conditions: true,
			procedures: true,
			specialties: true,
		});
	}
	async store(dto: CreatePhysicianDTO): Promise<PhysicianWithRelations> {
		return await db
			.insertInto("physicians")
			.values(prepareToInsert(dto))
			.returningAll()
			.executeTakeFirstOrThrow()
			.catch(handleDBErrors)
			.then(objectToCamel)
			.then((physician) => this.storePhysicianLanguages(physician, dto.languages))
			.then((physician) => this.storePhysicianSpecialties(physician, dto.specialties))
			.then((physician) =>
				this.storePhysicianTreatConditions(physician, dto.treatConditions),
			)
			.then((physician) =>
				this.storePhysicianProvideProcedures(physician, dto.provideProcedures),
			);
	}
	updateByUserId(userId: number, dto: UpdatePhysicianDTO): Promise<Physician> {
		return db
			.updateTable("physicians")
			.where("user_id", "=", userId)
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
			.executeTakeFirstOrThrow((_) => AppError.ENTITY_NOT_FOUND())
			.then(objectToCamel);
	}
	async deleteWhereUserId(userId: number): Promise<void> {
		await db.deleteFrom("physicians").where("user_id", "=", userId).execute();
	}

	async storePhysicianLanguages(physician: Physician, languages?: Language[]) {
		if (!languages || languages?.length === 0) {
			return { ...physician, languages: [] };
		}
		const values = languages.map((lang) => {
			return { language_id: lang.id, physician_id: physician.id };
		});
		return await db
			.insertInto("physicians_languages")
			.values(values)
			.onConflict((oc) => oc.constraint("physicians_languages_PK").doNothing())
			.returning(["language_id"])
			.execute()
			.then((ids) => {
				const idsList = ids.flatMap((el) => el.language_id);
				const physicianLangs = languages.filter((item) => idsList.includes(item.id));
				return { ...physician, languages: physicianLangs };
			});
	}
	async storePhysicianSpecialties(
		physician: Physician,
		specialties?: MedicalSpecialty[],
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
		return await db
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
	async storePhysicianTreatConditions(
		physician: Physician,
		conditions?: MedicalCondition[],
	) {
		if (!conditions || conditions?.length === 0) {
			return { ...physician, treatConditions: [] };
		}
		const values = conditions.map((el) => {
			return {
				condition_id: el.id,
				physician_id: physician.id,
			};
		});
		return await db
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
	async storePhysicianProvideProcedures(
		physician: Physician,
		procedures?: MedicalProcedure[],
	) {
		if (!procedures || procedures?.length === 0) {
			return { ...physician, provideProcedures: [] };
		}
		const values = procedures.map((el) => {
			return {
				procedure_id: el.id,
				physician_id: physician.id,
			};
		});
		return await db
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
function preparePhysicianObj(
	physician?: ObjectToSnake<PhysicianWithRelations>,
): PhysicianWithRelations | undefined {
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
		if (physicianCamelCase.languages == null) {
			physicianCamelCase.languages = [];
		}
		return physicianCamelCase;
	}
	return undefined;
}
function prepareToInsert(dto: CreatePhysicianDTO) {
	return objectToSnake({
		biography: dto.biography,
		fullName: dto.fullName,
		dateOfBirth: dto.dateOfBirth,
		isMale: dto.isMale,
		mobilePhoneNumber: dto.mobilePhoneNumber,
		phoneNumber: dto.phoneNumber,
		pictureUrl: dto.pictureUrl,
		userId: dto.userId,
	});
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
