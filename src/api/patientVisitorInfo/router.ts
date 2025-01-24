import ApiResponse from "@common/models/apiResponse";
import { getAppCtx } from "@common/utils/getAppCtx";
import { createPaginatedJsonResponse } from "@common/utils/paginationHelpers";
import { commonZodSchemas } from "@common/zod/common";
import express, { type Request, type Response, type Router } from "express";
import { isAdmin } from "../auth/middlewares/isAdmin";
import { PatientVisitorInfoCategorySchemas } from "./types";

const router: Router = express.Router();

export const patientVisitorInfoRoutes = {
	baseRoute: "/patient-visitor-info",
	categories: {
		getAll: "/categories",
		create: "/categories",
		update: (id = ":id") => `/categories/${id}`,
		delete: (id = ":id") => `/categories/${id}`,
	},
} as const;

// Routes
router.get(patientVisitorInfoRoutes.categories.getAll, getAllCategories);
router.post(patientVisitorInfoRoutes.categories.create, isAdmin, createCategory);
router.put(patientVisitorInfoRoutes.categories.update(), isAdmin, updateCategory);
router.delete(patientVisitorInfoRoutes.categories.delete(), isAdmin, deleteCategory);

// Route handlers
async function getAllCategories(req: Request, res: Response) {
	const query = await commonZodSchemas.queryParams.parseAsync(req.query);
	const categories =
		await getAppCtx().patientVisitorInfoCategoriesRepository.getAll(query);

	return ApiResponse.success({
		data: createPaginatedJsonResponse(categories, {
			resourceURL: req.baseUrl,
			from: query.from,
			perPage: query.perPage,
		}),
	}).send(res);
}

async function createCategory(req: Request, res: Response) {
	const data = await PatientVisitorInfoCategorySchemas.create.parseAsync(req.body);
	const category = await getAppCtx().patientVisitorInfoCategoriesRepository.store(data);

	return ApiResponse.success({ data: category }).send(res);
}

async function updateCategory(req: Request, res: Response) {
	const { id } = req.params;
	const data = await PatientVisitorInfoCategorySchemas.update.parseAsync(req.body);
	const category = await getAppCtx().patientVisitorInfoCategoriesRepository.update(
		Number(id),
		data,
	);

	return ApiResponse.success({ data: category }).send(res);
}

async function deleteCategory(req: Request, res: Response) {
	const { id } = req.params;
	await getAppCtx().patientVisitorInfoCategoriesRepository.delete(Number(id));

	return ApiResponse.success().send(res);
}

export const patientVisitorInfoRouter = router;
