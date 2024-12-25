import { commonZodSchemas } from "@/common/zod/common";
import { z } from "zod";

export type PhysicianFeedbackCategory =
	typeof PhysicianFeedbackCategoryZodSchema._output;

export const PhysicianFeedbackCategoryZodSchema = z.object({
	id: commonZodSchemas.id,
	parentId: commonZodSchemas.id.optional(),
	name: z.string(),
});
