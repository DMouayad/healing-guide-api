import { commonZodSchemas } from "@/common/zod/common";
import { z } from "zod";

//  Review Schema
export const ZodReview = z.object({
	id: commonZodSchemas.id,
	reviewerId: commonZodSchemas.id,
	reviewedId: commonZodSchemas.id,
	reviewerName: z.string().nullable(),
	reviewText: z.string(),
	reviewStars: z.number().max(5).min(0).default(0).nullable(),
	writtenAt: z.date(),
});

export type Review = z.infer<typeof ZodReview>;

//  Create DTO Schema
export const ZodCreateReviewDTO = ZodReview.omit({
	id: true,
	writtenAt: true,
});

export type CreateReviewDTO = z.infer<typeof ZodCreateReviewDTO>;

//  Update DTO Schema
export const ZodUpdateReviewDTO = ZodReview.omit({ writtenAt: true }).partial({
	reviewerName: true,
	reviewStars: true,
	reviewText: true,
});

export type UpdateReviewDTO = z.infer<typeof ZodUpdateReviewDTO>;

// Common request schemas
export const FacilityIdParam = z.object({ facilityId: commonZodSchemas.id });
export const PhysicianIdParam = z.object({ physicianId: commonZodSchemas.id });

const ReviewedIdFromPhysicianId = PhysicianIdParam.transform((value) => ({
	reviewedId: value.physicianId,
}));

const ReviewedIdFromFacilityId = FacilityIdParam.transform((value) => ({
	reviewedId: value.facilityId,
}));

// Common request body schemas
const CreateOrUpdateReviewBody = ZodCreateReviewDTO.omit({
	reviewerId: true,
	reviewedId: true,
});
export const ReviewIdParam = z.object({ reviewId: commonZodSchemas.id });

const UpdateDeletePhysicianReviewParams = PhysicianIdParam.merge(
	ReviewIdParam,
).transform((value) => ({
	reviewedId: value.physicianId,
	reviewId: value.reviewId,
}));
const UpdateDeleteFacilityReviewParams = FacilityIdParam.merge(ReviewIdParam).transform(
	(value) => ({
		reviewedId: value.facilityId,
		reviewId: value.reviewId,
	}),
);

// Review request schemas for both entity types

export const ReviewRequests = {
	physician: {
		getReviews: {
			params: ReviewedIdFromPhysicianId,
		},
		addReviewByUser: {
			params: ReviewedIdFromPhysicianId,
			body: CreateOrUpdateReviewBody,
		},
		updateReview: {
			params: UpdateDeletePhysicianReviewParams,
			body: CreateOrUpdateReviewBody,
		},
		deleteReview: {
			params: UpdateDeletePhysicianReviewParams,
		},
	},
	facility: {
		getReviews: {
			params: ReviewedIdFromFacilityId,
		},
		addReviewByUser: {
			params: ReviewedIdFromFacilityId,
			body: CreateOrUpdateReviewBody,
		},
		updateReview: {
			params: UpdateDeleteFacilityReviewParams,
			body: CreateOrUpdateReviewBody,
		},
		deleteReview: {
			params: UpdateDeleteFacilityReviewParams,
		},
	},
};
export type GetReviewsRequest =
	| typeof ReviewRequests.facility.getReviews
	| typeof ReviewRequests.physician.getReviews;
export type AddReviewRequest =
	| typeof ReviewRequests.facility.addReviewByUser
	| typeof ReviewRequests.physician.addReviewByUser;

export type UpdateReviewRequest =
	| typeof ReviewRequests.facility.updateReview
	| typeof ReviewRequests.physician.updateReview;

export type DeleteReviewRequest =
	| typeof ReviewRequests.facility.deleteReview
	| typeof ReviewRequests.physician.deleteReview;
