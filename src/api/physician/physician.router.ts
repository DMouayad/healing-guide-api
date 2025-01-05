import { APP_ROLES } from "@/common/types";
import express, { type Router } from "express";
import { authenticated } from "../auth/middlewares/authenticated";
import { authorized } from "../auth/middlewares/authorized";
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
	update: "/me",
	receivedFeedbacks: (physicianId = ":physicianId") =>
		`/${physicianId}/received-feedbacks`,
} as const;

router.get(routes.getById(), getByIdAction);
router.post(routes.create, authenticated, identityConfirmed, createAction);
router.patch(
	routes.update,
	authenticated,
	authorized(APP_ROLES.physician),
	identityConfirmed,
	updateAction,
);
/** Received Feedbacks */
router.post(routes.receivedFeedbacks(), authenticated, createFeedbackAction);
router.patch(routes.receivedFeedbacks(), authenticated, updateFeedbackAction);
router.get(routes.receivedFeedbacks(), getPhysicianFeedbacksAction);

export const physicianRoutes = routes;
export const physicianRouter = router;
