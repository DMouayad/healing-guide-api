import ApiResponse from "@/common/models/apiResponse";
import { getAppCtx } from "@/common/utils/getAppCtx";
import { createPaginatedJsonResponse } from "@/common/utils/paginationHelpers";
import { commonZodSchemas } from "@/common/zod/common";
import express, { type Request, type Response, type Router } from "express";
import { isAdmin } from "../auth/middlewares/isAdmin";

const router: Router = express.Router();
export const medicalSpecialtiesRouter = router;
export const medicalSpecialtiesRoutes = {
	baseRoute: "/medical-specialties",
	getByID: "/:id",
	getAll: "",
	add: "",
	delete: "/:id",
	edit: "/:id",
} as const;

router.get(medicalSpecialtiesRoutes.getAll, getAllAction);
router.get(medicalSpecialtiesRoutes.getByID, getByIdAction);
router.post(medicalSpecialtiesRoutes.add, isAdmin, addAction);
router.patch(medicalSpecialtiesRoutes.edit, isAdmin, updateAction);
router.delete(medicalSpecialtiesRoutes.delete, isAdmin, deleteAction);

async function getAllAction(req: Request, res: Response) {
	const query = await commonZodSchemas.queryParams.parseAsync(req.query);
	return getAppCtx()
		.medicalSpecialtiesRepository.getAll(query)
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
	const params = await commonZodSchemas.requestIdParam.parseAsync(req.params);

	return getAppCtx()
		.medicalSpecialtiesRepository.getById(params.id)
		.then((item) => ApiResponse.success({ data: item }).send(res));
}
async function addAction(req: Request, res: Response) {
	const data = await commonZodSchemas.requestBodyWithName.parseAsync(req.body);

	return getAppCtx()
		.medicalSpecialtiesRepository.store(data.name)
		.then((item) => ApiResponse.success({ data: item }).send(res));
}

async function deleteAction(req: Request, res: Response) {
	const params = await commonZodSchemas.requestIdParam.parseAsync(req.params);
	return getAppCtx()
		.medicalSpecialtiesRepository.delete(params.id)
		.then((item) => ApiResponse.success().send(res));
}

async function updateAction(req: Request, res: Response) {
	const data = await commonZodSchemas.requestBodyWithName.parseAsync(req.body);
	const params = await commonZodSchemas.requestIdParam.parseAsync(req.params);
	return getAppCtx()
		.medicalSpecialtiesRepository.update(params.id, data)
		.then((item) => ApiResponse.success().send(res));
}
