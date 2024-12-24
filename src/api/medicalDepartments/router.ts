import ApiResponse from "@/common/models/apiResponse";
import { getAppCtx } from "@/common/utils/getAppCtx";
import { createPaginatedJsonResponse } from "@/common/utils/paginationHelpers";
import { commonZodSchemas, requestWithIdParamSchema } from "@/common/zod/common";
import express, { type Request, type Response, type Router } from "express";
import { z } from "zod";
import { isAdmin } from "../auth/middlewares/isAdmin";

const router: Router = express.Router();
export const medicalDepartmentsRouter = router;
export const medicalDepartmentsRoutes = {
	baseRoute: "/medical-departments",
	getByID: "/:id",
	getAll: "/",
	add: "/",
	delete: "/:id",
	edit: "/:id",
} as const;

router.get(medicalDepartmentsRoutes.getAll, getAllAction);
router.get(medicalDepartmentsRoutes.getByID, getByIdAction);
router.post(medicalDepartmentsRoutes.add, addAction);
router.patch(medicalDepartmentsRoutes.edit, isAdmin, updateAction);
router.delete(medicalDepartmentsRoutes.getByID, isAdmin, deleteAction);

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

async function getByIdAction(req: Request, res: Response) {
	const data = await requestWithIdParamSchema.parseAsync(req.body);

	return getAppCtx()
		.medicalDepartmentsRepository.getById(data.params.id.toString())
		.then((item) => ApiResponse.success({ data: item }).send(res));
}
export const addMedDepartmentSchema = {
	body: z.object({ name: z.string() }),
};
async function addAction(req: Request, res: Response) {
	const data = await addMedDepartmentSchema.body.parseAsync(req.body);

	return getAppCtx()
		.medicalDepartmentsRepository.store(data.name)
		.then((item) => ApiResponse.success({ data: item }).send(res));
}

async function deleteAction(req: Request, res: Response) {
	const data = await requestWithIdParamSchema.parseAsync(req.body);
	return getAppCtx()
		.medicalDepartmentsRepository.delete(data.params.id.toString())
		.then((item) => ApiResponse.success().send(res));
}
export const updateMedDepartmentSchema = {
	params: z.object({ id: z.string() }),
	body: z.object({ name: z.string() }),
};
async function updateAction(req: Request, res: Response) {
	const data = await updateMedDepartmentSchema.body.parseAsync(req.body);
	const params = await updateMedDepartmentSchema.params.parseAsync(req.params);
	return getAppCtx()
		.medicalDepartmentsRepository.update(params.id, data)
		.then((item) => ApiResponse.success().send(res));
}
