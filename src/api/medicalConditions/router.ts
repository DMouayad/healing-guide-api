import ApiResponse from "@/common/models/apiResponse";
import { getAppCtx } from "@/common/utils/getAppCtx";
import { createPaginatedJsonResponse } from "@/common/utils/paginationHelpers";
import { commonZodSchemas, requestWithIdParamSchema } from "@/common/zod/common";
import express, { type Request, type Response, type Router } from "express";
import { isAdmin } from "../auth/middlewares/isAdmin";

const router: Router = express.Router();
export const medicalConditionsRouter = router;
export const medicalConditionsRoutes = {
	baseRoute: "/medical-conditions",
	getByID: "/:id",
	getAll: "/",
	add: "/",
	delete: "/:id",
	edit: "/:id",
} as const;

router.get(medicalConditionsRoutes.getAll, getAllAction);
router.get(medicalConditionsRoutes.getByID, getByIdAction);
router.post(medicalConditionsRoutes.add, isAdmin, addAction);
router.patch(medicalConditionsRoutes.edit, isAdmin, updateAction);
router.delete(medicalConditionsRoutes.delete, isAdmin, deleteAction);

async function getAllAction(req: Request, res: Response) {
	const query = await commonZodSchemas.queryParams.parseAsync(req.query);
	return getAppCtx()
		.medicalConditionsRepository.getAll(query)
		.then((items) => {
			const data = createPaginatedJsonResponse(items, {
				resourceURL: req.baseUrl,
				from: query.from,
				perPage: query.perPage,
			});
			return ApiResponse.success({ data }).send(res);
		});
}

async function getByIdAction(req: Request, res: Response) {
	const params = await requestWithIdParamSchema.parseAsync(req.body);

	return getAppCtx()
		.medicalConditionsRepository.getById(params.id)
		.then((item) => ApiResponse.success({ data: item }).send(res));
}
async function addAction(req: Request, res: Response) {
	const data = await commonZodSchemas.requestBodyWithName.parseAsync(req.body);

	return getAppCtx()
		.medicalConditionsRepository.store(data.name)
		.then((item) => ApiResponse.success({ data: item }).send(res));
}

async function deleteAction(req: Request, res: Response) {
	const params = await requestWithIdParamSchema.parseAsync(req.body);
	return getAppCtx()
		.medicalConditionsRepository.delete(params.id)
		.then((item) => ApiResponse.success().send(res));
}

async function updateAction(req: Request, res: Response) {
	const data = await commonZodSchemas.requestBodyWithName.parseAsync(req.body);
	const id = await commonZodSchemas.requestIdParam.parseAsync(req.params);
	return getAppCtx()
		.medicalConditionsRepository.update(id, data)
		.then((item) => ApiResponse.success().send(res));
}