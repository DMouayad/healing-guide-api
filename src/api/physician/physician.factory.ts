import { faker } from "@faker-js/faker";
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
			relations: {
				provideProcedures: args.provideProcedures ?? [],
				specialties: args.specialties ?? [],
				treatConditions: args.treatConditions ?? [],
			},
		};
	},
};
