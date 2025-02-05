import express, { type Request, type Response, type Router } from "express";
import ApiResponse from "src/common/models/apiResponse";
import { getAppCtx } from "src/common/utils/getAppCtx";
import { createPaginatedJsonResponse } from "src/common/utils/paginationHelpers";
import { commonZodSchemas } from "src/common/zod/common";
import { isAdmin } from "../auth/middlewares/isAdmin";
import { PatientVisitorResourceCategorySchemas } from "./types";

const router: Router = express.Router();

export const patientVisitorResourceCategoryRoutes = {
	baseRoute: "/patient-visitor-resources/categories",
	getAll: "/",
	create: "/",
	update: (id = ":id") => `/${id}`,
	delete: (id = ":id") => `/${id}`,
} as const;

// Routes
router.get(patientVisitorResourceCategoryRoutes.getAll, getAllCategories);
router.post(patientVisitorResourceCategoryRoutes.create, isAdmin, createCategory);
router.put(patientVisitorResourceCategoryRoutes.update(), isAdmin, updateCategory);
router.delete(patientVisitorResourceCategoryRoutes.delete(), isAdmin, deleteCategory);

// Route handlers
async function getAllCategories(req: Request, res: Response) {
	const query = await commonZodSchemas.queryParams.parseAsync(req.query);
	const categories =
		await getAppCtx().patientVisitorResourceCategoriesRepository.getAll(query);

	return ApiResponse.success({
		data: createPaginatedJsonResponse(categories, {
			resourceURL: req.baseUrl,
			from: query.from,
			perPage: query.perPage,
		}),
	}).send(res);
}

async function createCategory(req: Request, res: Response) {
	const data = await PatientVisitorResourceCategorySchemas.create.parseAsync(req.body);
	const category =
		await getAppCtx().patientVisitorResourceCategoriesRepository.store(data);

	return ApiResponse.success({ data: category }).send(res);
}

async function updateCategory(req: Request, res: Response) {
	const { id } = req.params;
	const data = await PatientVisitorResourceCategorySchemas.update.parseAsync(req.body);
	const category = await getAppCtx().patientVisitorResourceCategoriesRepository.update(
		Number(id),
		data,
	);

	return ApiResponse.success({ data: category }).send(res);
}

async function deleteCategory(req: Request, res: Response) {
	const { id } = req.params;
	await getAppCtx().patientVisitorResourceCategoriesRepository.delete(Number(id));

	return ApiResponse.success().send(res);
}

export const patientVisitorResourceCategoryRouter = router;
