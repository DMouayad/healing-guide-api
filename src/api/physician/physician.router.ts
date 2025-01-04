import express, { type Router } from "express";
import { authenticated } from "../auth/middlewares/authenticated";
import { identityConfirmed } from "../auth/middlewares/identityConfirmed";
import {
	createAction,
	createFeedbackAction,
	getByIdAction,
	getPhysicianFeedbacksAction,
	updateAction,
	updateFeedbackAction,
} from "./physician.actions";

const router: Router = express.Router();
const routes = {
	baseRoute: "/physicians",
	create: "",
	getById: (id = ":id") => `/${id}`,
	update: (id = ":id") => `/${id}`,
	createNewFeedback: (physicianId = ":physicianId") =>
		`/${physicianId}/received-feedbacks`,
	getPhysicianFeedbacks: (physicianId = ":physicianId") =>
		`/${physicianId}/received-feedbacks`,
	updateFeedback: (physicianId = ":physicianId") =>
		`/${physicianId}/received-feedbacks`,
} as const;

router.get(routes.getById(), getByIdAction);
router.post(routes.create, authenticated, identityConfirmed, createAction);
router.patch(routes.update(), authenticated, identityConfirmed, updateAction);

router.post(routes.createNewFeedback(), authenticated, createFeedbackAction);
router.patch(routes.updateFeedback(), authenticated, updateFeedbackAction);
router.get(routes.getPhysicianFeedbacks(), getPhysicianFeedbacksAction);

export const physicianRoutes = routes;
export const physicianRouter = router;
