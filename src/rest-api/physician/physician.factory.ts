import { faker } from "@faker-js/faker";
import type { Language } from "../languages/language.types";
import type { MedicalCondition } from "../medicalConditions/types";
import type { MedicalProcedure } from "../medicalProcedures/types";
import type { MedicalSpecialty } from "../medicalSpecialties/types";
import type { CreatePhysicianDTO } from "./physician.types";

export const PhysicianFactory = {
	create(
		args: {
			treatConditions?: MedicalCondition[];
			provideProcedures?: MedicalProcedure[];
			specialties?: MedicalSpecialty[];
			languages?: Language[];
		} = {},
	): CreatePhysicianDTO {
		return {
			biography: faker.person.bio(),
			dateOfBirth: faker.date.anytime(),
			fullName: faker.person.fullName(),
			isMale: faker.person.sex().toLowerCase() === "male",
			mobilePhoneNumber: faker.phone.number(),
			phoneNumber: faker.phone.number(),
			userId: 2,
			pictureUrl: null,
			provideProcedures: args.provideProcedures ?? [],
			specialties: args.specialties ?? [],
			treatConditions: args.treatConditions ?? [],
			languages: args.languages ?? [],
		};
	},
};
