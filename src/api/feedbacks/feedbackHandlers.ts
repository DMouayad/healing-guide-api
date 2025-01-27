import { feedbackRequests } from "@/api/feedbacks/types";
import ApiResponse from "@common/models/apiResponse";
import { createPaginatedJsonResponse } from "@common/utils/paginationHelpers";
import { commonZodSchemas } from "@common/zod/common";
import type { Request, Response, Router } from "express";
import { isAdmin } from "../auth/middlewares/isAdmin";
import type { IFeedbackRepository } from "./FeedbackRepository";
import type { FeedbackCRUDRoutes } from "./feedback.utils";

export function feedbackHandler(
	router: Router,
	routes: FeedbackCRUDRoutes,
	repository: IFeedbackRepository,
) {
	/** Categories routes */
	router.get(routes.getAll, getAllAction);
	router.use(isAdmin);
	router.post(routes.addCategory, addCategoryAction);
	router.patch(routes.editCategory(), updateCategoryAction);
	router.delete(routes.deleteCategory(), deleteCategoryAction);
	/** Questions routes */
	router.post(routes.addQuestion, addQuestionAction);
	router.patch(routes.editQuestion(), updateQuestionAction);
	router.delete(routes.deleteQuestion(), deleteQuestionAction);
	async function addQuestionAction(req: Request, res: Response) {
		const data = await feedbackRequests.addQuestion.parseAsync(req.body);

		return repository
			.storeQuestion(data)
			.then((item) => ApiResponse.success({ data: item }).send(res));
	}

	async function updateQuestionAction(req: Request, res: Response) {
		const data = await feedbackRequests.updateQuestion.parseAsync(req.body);
		const params = await commonZodSchemas.requestIdParam.parseAsync(req.params);
		return repository
			.updateQuestion(params.id, data)
			.then((item) => ApiResponse.success().send(res));
	}
	async function deleteQuestionAction(req: Request, res: Response) {
		const params = await commonZodSchemas.requestIdParam.parseAsync(req.params);
		return repository
			.deleteQuestion(params.id)
			.then((item) => ApiResponse.success().send(res));
	}

	async function getAllAction(req: Request, res: Response) {
		const query = await commonZodSchemas.queryParams.parseAsync(req.query);
		return repository.getAll(query).then((items) => {
			const data = createPaginatedJsonResponse(
				items,
				{
					resourceURL: req.baseUrl,
					from: query.from,
					perPage: query.perPage,
				},
				(item) => item?.categoryId,
			);
			return ApiResponse.success({ data }).send(res);
		});
	}

	async function addCategoryAction(req: Request, res: Response) {
		const data = await feedbackRequests.addCategory.parseAsync(req.body);

		return repository
			.storeCategory(data)
			.then((item) => ApiResponse.success({ data: item }).send(res));
	}

	async function deleteCategoryAction(req: Request, res: Response) {
		const params = await commonZodSchemas.requestIdParam.parseAsync(req.params);
		return repository
			.deleteCategory(params.id)
			.then((item) => ApiResponse.success().send(res));
	}
	async function updateCategoryAction(req: Request, res: Response) {
		const data = await feedbackRequests.updateCategory.parseAsync(req.body);
		const params = await commonZodSchemas.requestIdParam.parseAsync(req.params);
		return repository
			.updateCategory(params.id, data)
			.then((item) => ApiResponse.success().send(res));
	}
}
