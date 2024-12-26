import ApiResponse from "@/common/models/apiResponse";
import { getAppCtx } from "@/common/utils/getAppCtx";
import { createPaginatedJsonResponse } from "@/common/utils/paginationHelpers";
import { commonZodSchemas } from "@/common/zod/common";
import express, { type Request, type Response, type Router } from "express";
import { isAdmin } from "../auth/middlewares/isAdmin";
import { PhysicianFeedbackCategoryZodSchema } from "./types";

const router: Router = express.Router();
export const physicianFeedbackCategoriesRouter = router;
export const physicianFeedbackCategoriesRoutes = {
	baseRoute: "/physician-feedback-categories",
	getAll: "",
	add: "",
	delete: "/:id",
	edit: "/:id",
} as const;

router.get(physicianFeedbackCategoriesRoutes.getAll, getAllAction);
router.post(physicianFeedbackCategoriesRoutes.add, isAdmin, addAction);
router.patch(physicianFeedbackCategoriesRoutes.edit, isAdmin, updateAction);
router.delete(physicianFeedbackCategoriesRoutes.delete, isAdmin, deleteAction);

async function getAllAction(req: Request, res: Response) {
	const query = await commonZodSchemas.queryParams.parseAsync(req.query);
	return getAppCtx()
		.physicianFeedbackCategoriesRepository.getAll(query)
		.then((items) => {
			const data = createPaginatedJsonResponse(items, {
				resourceURL: req.baseUrl,
				from: query.from,
				perPage: query.perPage,
			});
			return ApiResponse.success({ data }).send(res);
		});
}

async function addAction(req: Request, res: Response) {
	const data = await PhysicianFeedbackCategoryZodSchema.omit({ id: true }).parseAsync(
		req.body,
	);

	return getAppCtx()
		.physicianFeedbackCategoriesRepository.store(data)
		.then((item) => ApiResponse.success({ data: item }).send(res));
}

async function deleteAction(req: Request, res: Response) {
	const params = await commonZodSchemas.requestIdParam.parseAsync(req.params);
	return getAppCtx()
		.physicianFeedbackCategoriesRepository.delete(params.id)
		.then((item) => ApiResponse.success().send(res));
}
async function updateAction(req: Request, res: Response) {
	const data = await PhysicianFeedbackCategoryZodSchema.omit({ id: true }).parseAsync(
		req.body,
	);
	const params = await commonZodSchemas.requestIdParam.parseAsync(req.params);
	return getAppCtx()
		.physicianFeedbackCategoriesRepository.update(params.id, data)
		.then((item) => ApiResponse.success().send(res));
}
