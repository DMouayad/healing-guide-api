import { commonZodSchemas } from "@/common/zod/common";
import { z } from "zod";
import { MedicalConditionZodSchema } from "../medicalConditions/types";
import { MedicalProcedureZodSchema } from "../medicalProcedures/types";
import { MedicalSpecialtyZodSchema } from "../medicalSpecialties/types";

export const PhysicianZodSchema = z.object({
	id: commonZodSchemas.id,
	fullName: z.string(),
	biography: z.string(),
	createdAt: z.date(),
	dateOfBirth: z.date(),
	isMale: z.boolean(),
	mobilePhoneNumber: z.string(),
	phoneNumber: z.string().nullable(),
	pictureUrl: z.string().nullable(),
	userId: commonZodSchemas.id,
});

export const ZodPhysicianRelations = z.object({
	specialties: z
		.array(MedicalSpecialtyZodSchema.merge(commonZodSchemas.nullableName))
		.default([]),
	treatConditions: z
		.array(MedicalConditionZodSchema.merge(commonZodSchemas.nullableName))
		.default([]),
	provideProcedures: z
		.array(MedicalProcedureZodSchema.merge(commonZodSchemas.nullableName))
		.default([]),
});
export type PhysicianRelations = typeof ZodPhysicianRelations._output;
export type Physician = typeof PhysicianZodSchema._output;
export type PhysicianWithRelations = Physician & PhysicianRelations;
/**
 * DTOs */
const ZodCreatePhysicianDTO = PhysicianZodSchema.merge(
	z.object({
		relations: ZodPhysicianRelations.optional(),
	}),
).omit({
	id: true,
	createdAt: true,
});
export type CreatePhysicianDTO = typeof ZodCreatePhysicianDTO._output;

const ZodUpdatePhysicianDTO = PhysicianZodSchema.merge(ZodPhysicianRelations)
	.omit({
		id: true,
		userId: true,
		createdAt: true,
	})
	.partial();
export type UpdatePhysicianDTO = typeof ZodUpdatePhysicianDTO._output;
/**
 * Physician Resources */
export const ZodPhysicianResource = PhysicianZodSchema.omit({ userId: true });
export const ZodNewPhysicianResource = ZodPhysicianResource.omit({ id: true });
export type NewPhysicianResource = typeof ZodNewPhysicianResource._output;
export function createNewPhysicianResource(physician?: PhysicianWithRelations) {
	if (physician) {
		return {
			biography: physician.biography,
			createdAt: physician.createdAt,
			dateOfBirth: physician.dateOfBirth,
			isMale: physician.isMale,
			phoneNumber: physician.phoneNumber,
			mobilePhoneNumber: physician.mobilePhoneNumber,
			fullName: physician.fullName,
			pictureUrl: physician.pictureUrl,
			treatConditions: physician.treatConditions ?? [],
			provideProcedures: physician.provideProcedures ?? [],
			specialties: physician.specialties ?? [],
		};
	}
}
/**
 * Physician Requests Schemas */
export const physicianRequests = {
	create: ZodCreatePhysicianDTO.omit({ userId: true }),
	update: z.object({
		params: commonZodSchemas.requestIdParam,
		body: ZodUpdatePhysicianDTO,
	}),
};
