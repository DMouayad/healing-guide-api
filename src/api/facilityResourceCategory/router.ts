import ApiResponse from "@common/models/apiResponse";
import { getAppCtx } from "@common/utils/getAppCtx";
import { createPaginatedJsonResponse } from "@common/utils/paginationHelpers";
import { commonZodSchemas } from "@common/zod/common";
import express, { type Request, type Response, type Router } from "express";
import { isAdmin } from "../auth/middlewares/isAdmin";

const router: Router = express.Router();
export const facilityResourceCategoryRouter = router;
export const facilityResourceCategoryRoutes = {
	baseRoute: "/facility-resource-categories",
	getAll: "",
	add: "",
	delete: (id = ":id") => `/${id}`,
	edit: (id = ":id") => `/${id}`,
} as const;

router.get(facilityResourceCategoryRoutes.getAll, getAllAction);
router.post(facilityResourceCategoryRoutes.add, isAdmin, addAction);
router.patch(facilityResourceCategoryRoutes.edit(), isAdmin, updateAction);
router.delete(facilityResourceCategoryRoutes.delete(), isAdmin, deleteAction);

async function getAllAction(req: Request, res: Response) {
	const query = await commonZodSchemas.queryParams.parseAsync(req.query);
	return getAppCtx()
		.facilityResourceCategoryRepository.getAll(query)
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
	const data = await commonZodSchemas.requestBodyWithName.parseAsync(req.body);

	return getAppCtx()
		.facilityResourceCategoryRepository.store(data.name)
		.then((item) => ApiResponse.success({ data: item }).send(res));
}

async function deleteAction(req: Request, res: Response) {
	const params = await commonZodSchemas.requestIdParam.parseAsync(req.params);
	return getAppCtx()
		.facilityResourceCategoryRepository.delete(params.id)
		.then((item) => ApiResponse.success().send(res));
}

async function updateAction(req: Request, res: Response) {
	const data = await commonZodSchemas.requestBodyWithName.parseAsync(req.body);
	const params = await commonZodSchemas.requestIdParam.parseAsync(req.params);
	return getAppCtx()
		.facilityResourceCategoryRepository.update(params.id, data)
		.then((item) => ApiResponse.success().send(res));
}
