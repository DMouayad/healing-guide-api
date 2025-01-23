import ApiResponse from "@common/models/apiResponse";
import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { getUserFromResponse } from "../auth/utils";
import type { IReviewsRepository } from "./IReviewsRepository";
import type {
	AddReviewRequest,
	CreateReviewDTO,
	DeleteReviewRequest,
	GetReviewsRequest,
	UpdateReviewDTO,
	UpdateReviewRequest,
} from "./reviews.types";

export function createReviewActions(
	requests: {
		getReviews: GetReviewsRequest;
		addReviewByUser: AddReviewRequest;
		updateReview: UpdateReviewRequest;
		deleteReview: DeleteReviewRequest;
	},
	repository: IReviewsRepository,
) {
	return {
		async getReviews(req: Request, res: Response) {
			const params = requests.getReviews.params.parse(req.params);

			const reviews = repository.getAllById(params.reviewedId);
			return ApiResponse.success({ data: reviews }).send(res);
		},
		async createReviewByUser(req: Request, res: Response) {
			const user = getUserFromResponse(res);
			const { reviewedId } = requests.addReviewByUser.params.parse(req.params);
			const body = requests.addReviewByUser.body.parse(req.body);
			const dto: CreateReviewDTO = {
				reviewedId: reviewedId,
				reviewerId: user.id,
				reviewerName: body.reviewerName,
				reviewStars: body.reviewStars,
				reviewText: body.reviewText,
			};
			const newReview = repository.store(dto);
			return ApiResponse.success({
				data: newReview,
				statusCode: StatusCodes.CREATED,
			}).send(res);
		},
		async editReview(req: Request, res: Response) {
			const user = getUserFromResponse(res);
			const { reviewId, reviewedId } = requests.updateReview.params.parse(req.params);
			const body = requests.updateReview.body.parse(req.body);
			const dto: UpdateReviewDTO = {
				id: reviewId,
				reviewedId,
				reviewerId: user.id,
				reviewerName: body.reviewerName,
				reviewStars: body.reviewStars,
				reviewText: body.reviewText,
			};
			const newReview = repository.update(dto);
			return ApiResponse.success({ data: newReview }).send(res);
		},
		async deleteReview(req: Request, res: Response) {
			const user = getUserFromResponse(res);
			const { reviewedId, reviewId } = requests.deleteReview.params.parse(req.params);
			await repository.deleteReview({
				reviewedId,
				reviewId,
				reviewerId: user.id,
			});
			return ApiResponse.success().send(res);
		},
	};
}
