import { commonZodSchemas } from "@/common/zod/common";
import { z } from "zod";
import { ZodLanguage } from "../languages/language.types";
import { MedicalConditionZodSchema } from "../medicalConditions/types";
import { MedicalProcedureZodSchema } from "../medicalProcedures/types";
import { MedicalSpecialtyZodSchema } from "../medicalSpecialties/types";
import {
	ZodCreatePhysicianReviewDTO,
	ZodUpdatePhysicianReviewDTO,
} from "./PhysicianReview";

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
	specialties: z.array(MedicalSpecialtyZodSchema).default([]),
	treatConditions: z.array(MedicalConditionZodSchema).default([]),
	provideProcedures: z.array(MedicalProcedureZodSchema).default([]),
	languages: z.array(ZodLanguage).default([]),
});
export type PhysicianRelations = typeof ZodPhysicianRelations._output;
export type Physician = typeof PhysicianZodSchema._output;
export type PhysicianWithRelations = Physician & PhysicianRelations;
/**
 * DTOs */
const ZodCreatePhysicianDTO = PhysicianZodSchema.merge(ZodPhysicianRelations).omit({
	id: true,
	createdAt: true,
});
export type CreatePhysicianDTO = typeof ZodCreatePhysicianDTO._output;

const ZodUpdatePhysicianDTO = PhysicianZodSchema.omit({
	userId: true,
	id: true,
	createdAt: true,
}).partial();
export type UpdatePhysicianDTO = typeof ZodUpdatePhysicianDTO._output;
/**
 * Physician Resources */
export const ZodPhysicianResource = PhysicianZodSchema.omit({ userId: true });
export const ZodNewPhysicianResource = ZodPhysicianResource.omit({ id: true });
export type NewPhysicianResource = typeof ZodNewPhysicianResource._output;
export function createNewPhysicianResource(physician?: PhysicianWithRelations) {
	if (!physician) {
		return {};
	}
	return {
		biography: physician.biography,
		createdAt: physician.createdAt,
		dateOfBirth: physician.dateOfBirth,
		isMale: physician.isMale,
		phoneNumber: physician.phoneNumber,
		mobilePhoneNumber: physician.mobilePhoneNumber,
		fullName: physician.fullName,
		pictureUrl: physician.pictureUrl,
		languages: physician.languages ?? [],
		treatConditions: physician.treatConditions ?? [],
		provideProcedures: physician.provideProcedures ?? [],
		specialties: physician.specialties ?? [],
	};
}
/**
 * Physician Requests Schemas */

const PhysicianIdParam = z.object({ physicianId: commonZodSchemas.id });
export const physicianRequests = {
	create: ZodCreatePhysicianDTO.omit({ userId: true }),
	update: { body: ZodUpdatePhysicianDTO },
	createOrUpdateFeedback: {
		params: PhysicianIdParam,
		body: z.object({ response: z.boolean(), questionId: commonZodSchemas.id }),
	},
	getPhysicianFeedbacks: {
		params: PhysicianIdParam,
	},
	getPhysicianReviews: {
		params: PhysicianIdParam,
	},
	addReviewByUser: {
		params: PhysicianIdParam,
		body: ZodCreatePhysicianReviewDTO.omit({ physicianId: true, reviewerId: true }),
	},
	updateReview: {
		params: PhysicianIdParam.merge(z.object({ reviewId: commonZodSchemas.id })),
		body: ZodUpdatePhysicianReviewDTO.omit({
			reviewId: true,
			physicianId: true,
			reviewerId: true,
		}),
	},
	deleteReview: {
		params: PhysicianIdParam.merge(z.object({ reviewId: commonZodSchemas.id })),
	},
	setRelationItems: {
		body: z.object({ itemsIds: z.array(commonZodSchemas.id) }),
	},
};
