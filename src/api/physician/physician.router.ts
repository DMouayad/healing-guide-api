import { getAppCtx } from "@/common/utils/getAppCtx";
import { APP_ROLES } from "@common/types";
import express, { type Router } from "express";
import { authenticated } from "../auth/middlewares/authenticated";
import { authorized } from "../auth/middlewares/authorized";
import { identityConfirmed } from "../auth/middlewares/identityConfirmed";
import { getFeedbackRoutes } from "../feedbacks/feedback.utils";
import { feedbackHandler } from "../feedbacks/feedbackHandlers";
import { receivedFeedbackHandler } from "../feedbacks/receivedFeedbackHandler";
import {
	createAction,
	createReviewByUser,
	deleteReview,
	editReview,
	getByIdAction,
	getPhysicianReviews,
	setProvidedProcedures,
	setSpecialties,
	setSpokenLanguages,
	setTreatConditions,
	updateAction,
} from "./physician.actions";

const router: Router = express.Router();
const routes = {
	baseRoute: "/physicians",
	create: "",
	getById: (id = ":id") => `/${id}`,
	update: "/me",
	receivedFeedbacks: (physicianId = ":physicianId") =>
		`/${physicianId}/received-feedbacks`,
	treatConditions: "/me/treat-conditions",
	providedProcedures: "/me/provided-procedures",
	languages: "/me/languages",
	specialties: "/me/specialties",
	getReviews: (physicianId = ":physicianId") => `/${physicianId}/reviews`,
	createPhysicianReview: (physicianId = ":physicianId") => `/${physicianId}/reviews`,
	reviewById: (physicianId = ":physicianId", reviewId = ":reviewId") =>
		`/${physicianId}/reviews/${reviewId}`,
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
/** Treat Conditions */
router.post(
	routes.treatConditions,
	authenticated,
	authorized(APP_ROLES.physician),
	setTreatConditions,
);
/** Provided Procedures */
router.post(
	routes.providedProcedures,
	authenticated,
	authorized(APP_ROLES.physician),
	setProvidedProcedures,
);
/** Specialties */
router.post(
	routes.specialties,
	authenticated,
	authorized(APP_ROLES.physician),
	setSpecialties,
);
/** Languages */
router.post(
	routes.languages,
	authenticated,
	authorized(APP_ROLES.physician),
	setSpokenLanguages,
);
/** Reviews  */
router.get(routes.getReviews(), getPhysicianReviews);
router.post(routes.createPhysicianReview(), authenticated, createReviewByUser);
router.patch(routes.reviewById(), authenticated, editReview);
router.delete(routes.reviewById(), authenticated, deleteReview);

export const physicianRoutes = routes;
export const physicianRouter = router;

// Physician Feedback questions & categories management
export const physicianFeedbackRouter: Router = express.Router();
export const physicianFeedbackRoutes = getFeedbackRoutes("/physician-feedbacks");

feedbackHandler(
	physicianFeedbackRouter,
	physicianFeedbackRoutes,
	getAppCtx().physicianFeedbackRepository,
);

// Physician Received Feedbacks
receivedFeedbackHandler(
	router,
	routes.receivedFeedbacks(),
	getAppCtx().physicianReceivedFeedbackRepository,
	"physician",
);
