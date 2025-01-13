import { commonZodSchemas } from "@common/zod/common";
import { z } from "zod";

export type PhysicianFeedbackCategory =
	typeof PhysicianFeedbackCategoryZodSchema._output;

const categoryZodSchema = z.object({
	id: commonZodSchemas.id,
	parentCategoryId: commonZodSchemas.id.optional().nullable(),
	name: z.string(),
});
export const PhysicianFeedbackCategoryZodSchema = categoryZodSchema;
export const CreatePhysicianFeedbackCategorySchema = categoryZodSchema.omit({
	id: true,
});
export const UpdatePhysicianFeedbackCategorySchema = categoryZodSchema
	.partial({
		parentCategoryId: true,
	})
	.or(categoryZodSchema.required().partial({ name: true }));

export type UpdatePhysicianFeedbackCategoryDTO =
	typeof UpdatePhysicianFeedbackCategorySchema._output;
export type CreatePhysicianFeedbackCategoryDTO =
	typeof CreatePhysicianFeedbackCategorySchema._output;
/**Question */
const questionSchema = z.object({
	id: commonZodSchemas.id,
	question: z.string(),
	categoryId: commonZodSchemas.id,
});
export type PhysicianFeedbackQuestion =
	typeof PhysicianFeedbackQuestionZodSchema._output;

export const PhysicianFeedbackQuestionZodSchema = questionSchema;

const CreatePhysicianFeedbackQuestionDTOSchema = questionSchema.omit({ id: true });
export type CreatePhysicianFeedbackQuestionDTO =
	typeof CreatePhysicianFeedbackQuestionDTOSchema._output;
export const UpdatePhysicianFeedbackQuestionDTOSchema = z.union([
	CreatePhysicianFeedbackQuestionDTOSchema.partial({ categoryId: true }),
	CreatePhysicianFeedbackQuestionDTOSchema.partial({ question: true }),
	CreatePhysicianFeedbackQuestionDTOSchema,
]);
export type UpdatePhysicianFeedbackQuestionDTO =
	typeof UpdatePhysicianFeedbackQuestionDTOSchema._output;

export const PhysicianFeedbackZodSchema = PhysicianFeedbackCategoryZodSchema.omit({
	id: true,
}).merge(
	z.object({
		categoryId: commonZodSchemas.id,
		questions: z.array(questionSchema),
	}),
);

export type PhysicianFeedback = typeof PhysicianFeedbackZodSchema._output;
export const ZodPhysicianFeedbackWithResponse = PhysicianFeedbackZodSchema.merge(
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
export type PhysicianFeedbackWithUserResponses =
	typeof ZodPhysicianFeedbackWithResponse._output;
export const ZodPhysicianReceivedFeedback = z.object({
	physicianId: commonZodSchemas.id,
	questionId: commonZodSchemas.id,
	userId: commonZodSchemas.id,
	response: z.boolean(),
});
export type PhysicianReceivedFeedback = z.infer<typeof ZodPhysicianReceivedFeedback>;
/**
 * Requests
 */
export const physicianFeedbackRequests = {
	addQuestion: CreatePhysicianFeedbackQuestionDTOSchema,
	updateQuestion: UpdatePhysicianFeedbackQuestionDTOSchema,
	addCategory: CreatePhysicianFeedbackCategorySchema,
	updateCategory: UpdatePhysicianFeedbackCategorySchema,
};
