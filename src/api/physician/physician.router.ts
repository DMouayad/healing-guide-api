import ApiResponse from "@/common/models/apiResponse";
import AppError from "@/common/models/appError";
import { getAppCtx } from "@/common/utils/getAppCtx";
import { commonZodSchemas } from "@/common/zod/common";
import express, { type Request, type Response, type Router } from "express";
import { authenticated } from "../auth/middlewares/authenticated";
import { identityConfirmed } from "../auth/middlewares/identityConfirmed";
import { getUserFromResponse } from "../auth/utils";
import { createNewPhysicianResource, physicianRequests } from "./physician.types";

const router: Router = express.Router();
const routes = {
	baseRoute: "/physicians",
	create: "",
	getById: (id = ":id") => `/${id}`,
	update: (id = ":id") => `/${id}`,
} as const;

export const physicianRoutes = routes;
export const physicianRouter = router;

router.get(routes.getById(), async (req, res) => {
	const params = await commonZodSchemas.requestIdParam.parseAsync(req.params);
	return getAppCtx()
		.physicianRepository.getWithRelations(params.id)
		.then((item) =>
			item
				? ApiResponse.success({ data: createNewPhysicianResource(item) })
				: ApiResponse.error(AppError.ENTITY_NOT_FOUND()),
		)
		.then((response) => response.send(res));
});
router.post(routes.create, authenticated, identityConfirmed, createAction);
router.patch(routes.update(), authenticated, identityConfirmed, updateAction);

async function createAction(req: Request, res: Response) {
	const user = getUserFromResponse(res);

	const data = await physicianRequests.create.parseAsync(req.body);
	return getAppCtx().physicianRepository.store({ ...data, userId: user.id });
}
async function updateAction(req: Request, res: Response) {
	const { body, params } = await physicianRequests.update.parseAsync({
		params: req.params,
		body: req.body,
	});
	return getAppCtx()
		.physicianRepository.update(params.id, body)
		.then((item) => ApiResponse.success({ data: item }).send(res));
}
