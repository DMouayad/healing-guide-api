import { commonZodSchemas } from "@/common/zod/common";
import { z } from "zod";

export const ZodPhysicianReview = z.object({
	id: commonZodSchemas.id,
	reviewerId: commonZodSchemas.id,
	physicianId: commonZodSchemas.id,
	reviewerName: z.string().nullable(),
	reviewText: z.string(),
	reviewStars: z.number().max(5).min(0).default(0).nullable(),
	writtenAt: z.date(),
});

export type PhysicianReview = z.infer<typeof ZodPhysicianReview>;

export const ZodCreatePhysicianReviewDTO = ZodPhysicianReview.omit({
	id: true,
	writtenAt: true,
});
export type CreatePhysicianReviewDTO = z.infer<typeof ZodCreatePhysicianReviewDTO>;

export const ZodUpdatePhysicianReviewDTO = ZodCreatePhysicianReviewDTO.partial()
	.required({
		physicianId: true,
		reviewerId: true,
	})
	.merge(z.object({ reviewId: commonZodSchemas.id }));
export type UpdatePhysicianReviewDTO = z.infer<typeof ZodUpdatePhysicianReviewDTO>;
