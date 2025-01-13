import ApiResponse from "@common/models/apiResponse";
import { getAppCtx } from "@common/utils/getAppCtx";
import { createPaginatedJsonResponse } from "@common/utils/paginationHelpers";
import { commonZodSchemas } from "@common/zod/common";
import express, { type Request, type Response, type Router } from "express";
import { isAdmin } from "../auth/middlewares/isAdmin";
import { physicianFeedbackRequests as requests } from "./types";

const router: Router = express.Router();
export const physicianFeedbackRouter = router;
const routes = {
	baseRoute: "/physician-feedbacks",
	getAll: "",
	addCategory: "/categories",
	addQuestion: "/questions",
	deleteCategory: (id = ":id") => `/categories/${id}`,
	editCategory: (id = ":id") => `/categories/${id}`,
	deleteQuestion: (id = ":id") => `/questions/${id}`,
	editQuestion: (id = ":id") => `/questions/${id}`,
} as const;
export const physicianFeedbackRoutes = routes;
router.use(isAdmin);

/** Categories routes */
router.get(routes.getAll, getAllAction);
router.post(routes.addCategory, addCategoryAction);
router.patch(routes.editCategory(), updateCategoryAction);
router.delete(routes.deleteCategory(), deleteCategoryAction);
/** Questions routes */
router.post(routes.addQuestion, addQuestionAction);
router.patch(routes.editQuestion(), updateQuestionAction);
router.delete(routes.deleteQuestion(), deleteQuestionAction);

async function addQuestionAction(req: Request, res: Response) {
	const data = await requests.addQuestion.parseAsync(req.body);

	return getAppCtx()
		.physicianFeedbackRepository.storeQuestion(data)
		.then((item) => ApiResponse.success({ data: item }).send(res));
}

async function updateQuestionAction(req: Request, res: Response) {
	const data = await requests.updateQuestion.parseAsync(req.body);
	const params = await commonZodSchemas.requestIdParam.parseAsync(req.params);
	return getAppCtx()
		.physicianFeedbackRepository.updateQuestion(params.id, data)
		.then((item) => ApiResponse.success().send(res));
}
async function deleteQuestionAction(req: Request, res: Response) {
	const params = await commonZodSchemas.requestIdParam.parseAsync(req.params);
	return getAppCtx()
		.physicianFeedbackRepository.deleteQuestion(params.id)
		.then((item) => ApiResponse.success().send(res));
}

async function getAllAction(req: Request, res: Response) {
	const query = await commonZodSchemas.queryParams.parseAsync(req.query);
	return getAppCtx()
		.physicianFeedbackRepository.getAll(query)
		.then((items) => {
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
	const data = await requests.addCategory.parseAsync(req.body);

	return getAppCtx()
		.physicianFeedbackRepository.storeCategory(data)
		.then((item) => ApiResponse.success({ data: item }).send(res));
}

async function deleteCategoryAction(req: Request, res: Response) {
	const params = await commonZodSchemas.requestIdParam.parseAsync(req.params);
	return getAppCtx()
		.physicianFeedbackRepository.deleteCategory(params.id)
		.then((item) => ApiResponse.success().send(res));
}
async function updateCategoryAction(req: Request, res: Response) {
	const data = await requests.updateCategory.parseAsync(req.body);
	const params = await commonZodSchemas.requestIdParam.parseAsync(req.params);
	return getAppCtx()
		.physicianFeedbackRepository.updateCategory(params.id, data)
		.then((item) => ApiResponse.success().send(res));
}
