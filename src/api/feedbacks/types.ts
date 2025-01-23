import { commonZodSchemas } from "@common/zod/common";
import { z } from "zod";
import { FacilityIdParam } from "../medicalFacility/medicalFacility.types";
import { PhysicianIdParam } from "../physician/physician.types";

export type FeedbackCategory = typeof FeedbackCategoryZodSchema._output;

const categoryZodSchema = z.object({
	id: commonZodSchemas.id,
	parentCategoryId: commonZodSchemas.id.optional().nullable(),
	name: z.string(),
});
export const FeedbackCategoryZodSchema = categoryZodSchema;
export const CreateFeedbackCategorySchema = categoryZodSchema.omit({
	id: true,
});
export const UpdateFeedbackCategorySchema = categoryZodSchema
	.partial({
		parentCategoryId: true,
	})
	.or(categoryZodSchema.required().partial({ name: true }));

export type UpdateFeedbackCategoryDTO = typeof UpdateFeedbackCategorySchema._output;
export type CreateFeedbackCategoryDTO = typeof CreateFeedbackCategorySchema._output;
/**Question */
const questionSchema = z.object({
	id: commonZodSchemas.id,
	question: z.string(),
	categoryId: commonZodSchemas.id,
});
export type FeedbackQuestion = typeof FeedbackQuestionZodSchema._output;

export const FeedbackQuestionZodSchema = questionSchema;

const CreateFeedbackQuestionDTOSchema = questionSchema.omit({ id: true });
export type CreateFeedbackQuestionDTO = typeof CreateFeedbackQuestionDTOSchema._output;
export const UpdateFeedbackQuestionDTOSchema = z.union([
	CreateFeedbackQuestionDTOSchema.partial({ categoryId: true }),
	CreateFeedbackQuestionDTOSchema.partial({ question: true }),
	CreateFeedbackQuestionDTOSchema,
]);
export type UpdateFeedbackQuestionDTO = typeof UpdateFeedbackQuestionDTOSchema._output;

export const FeedbackZodSchema = FeedbackCategoryZodSchema.omit({
	id: true,
}).merge(
	z.object({
		categoryId: commonZodSchemas.id,
		questions: z.array(questionSchema),
	}),
);

export type Feedback = typeof FeedbackZodSchema._output;
export const ZodFeedbackWithResponse = FeedbackZodSchema.merge(
	z.object({
		questions: z.array(
			questionSchema.merge(
				z.object({
					userResponse: z.boolean().nullable(),
					positiveResponseCount: z.number().max(100).min(0),
					totalResponsesCount: z.number(),
				}),
			),
		),
	}),
);
export type FeedbackWithUserResponses = typeof ZodFeedbackWithResponse._output;
//  Received Feedback
export const ZodReceivedFeedback = z.object({
	receiverId: commonZodSchemas.id,
	questionId: commonZodSchemas.id,
	userId: commonZodSchemas.id,
	response: z.boolean(),
});
export type ReceivedFeedback = z.infer<typeof ZodReceivedFeedback>;

/**
 * Requests
 */
export const feedbackRequests = {
	addQuestion: CreateFeedbackQuestionDTOSchema,
	updateQuestion: UpdateFeedbackQuestionDTOSchema,
	addCategory: CreateFeedbackCategorySchema,
	updateCategory: UpdateFeedbackCategorySchema,
};
const ReceiverIdFromPhysicianId = PhysicianIdParam.transform((value) => {
	return { receiverId: value.physicianId };
});
const ReceiverIdFromFacilityId = FacilityIdParam.transform((value) => {
	return { receiverId: value.facilityId };
});
const ReceivedFeedbackBody = z.object({
	response: z.boolean(),
	questionId: commonZodSchemas.id,
});
export const receivedFeedbackRequests = {
	physician: {
		createOrUpdate: {
			params: ReceiverIdFromPhysicianId,
			body: ReceivedFeedbackBody,
		},
		get: {
			params: ReceiverIdFromPhysicianId,
		},
	},
	facility: {
		createOrUpdate: {
			params: ReceiverIdFromFacilityId,
			body: ReceivedFeedbackBody,
		},
		get: {
			params: ReceiverIdFromFacilityId,
		},
	},
};
