import { z } from "zod";

export type PhysicianFeedbackCategory = {
	id: string;
	parentId?: string;
	name: string;
};

export const PhysicianFeedbackCategoryZodSchema = z.object({
	id: z.string(),
	parentId: z.string().optional(),
	name: z.string(),
});
