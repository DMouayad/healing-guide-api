import express, { type Request, type Response, type Router } from "express";
import ApiResponse from "src/common/models/apiResponse";
import { getAppCtx } from "src/common/utils/getAppCtx";
import { createPaginatedJsonResponse } from "src/common/utils/paginationHelpers";
import { commonZodSchemas } from "src/common/zod/common";
import { isAdmin } from "../auth/middlewares/isAdmin";

const router: Router = express.Router();
export const medicalDepartmentsRouter = router;
export const medicalDepartmentsRoutes = {
	baseRoute: "/medical-departments",
	getAll: "",
	add: "",
	delete: (id = ":id") => `/${id}`,
	edit: (id = ":id") => `/${id}`,
} as const;

router.get(medicalDepartmentsRoutes.getAll, getAllAction);
router.post(medicalDepartmentsRoutes.add, isAdmin, addAction);
router.patch(medicalDepartmentsRoutes.edit(), isAdmin, updateAction);
router.delete(medicalDepartmentsRoutes.delete(), isAdmin, deleteAction);

async function getAllAction(req: Request, res: Response) {
	const query = await commonZodSchemas.queryParams.parseAsync(req.query);
	return getAppCtx()
		.medicalDepartmentsRepository.getAll(query)
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
		.medicalDepartmentsRepository.store(data.name)
		.then((item) => ApiResponse.success({ data: item }).send(res));
}

async function deleteAction(req: Request, res: Response) {
	const params = await commonZodSchemas.requestIdParam.parseAsync(req.params);
	return getAppCtx()
		.medicalDepartmentsRepository.delete(params.id)
		.then((item) => ApiResponse.success().send(res));
}
async function updateAction(req: Request, res: Response) {
	const data = await commonZodSchemas.requestBodyWithName.parseAsync(req.body);
	const params = await commonZodSchemas.requestIdParam.parseAsync(req.params);
	return getAppCtx()
		.medicalDepartmentsRepository.update(params.id, data)
		.then((item) => ApiResponse.success().send(res));
}
