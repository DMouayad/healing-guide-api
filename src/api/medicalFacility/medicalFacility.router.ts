import { getAppCtx } from "@/common/utils/getAppCtx";
import express, { type Router } from "express";
import { getFeedbackRoutes } from "../feedbacks/feedback.utils";
import { feedbackHandler } from "../feedbacks/feedbackHandlers";
import { receivedFeedbackHandler } from "../feedbacks/receivedFeedbackHandler";

const router: Router = express.Router();
const routes = {
	baseRoute: "/medical-facilities",
	create: "",
	getById: (id = ":id") => `/${id}`,
	update: "/me",
	receivedFeedbacks: (facilityId = ":facilityId") =>
		`/${facilityId}/received-feedbacks`,
	getReviews: (facilityId = ":facilityId") => `/${facilityId}/reviews`,
	createFacilityReview: (facilityId = ":facilityId") => `/${facilityId}/reviews`,
	reviewById: (facilityId = ":facilityId", reviewId = ":reviewId") =>
		`/${facilityId}/reviews/${reviewId}`,
} as const;

export const medicalFacilityRoutes = routes;
export const medicalFacilityRouter = router;

// MedicalFacility Feedback questions & categories management (ADMIN)
export const medicalFacilityFeedbackRouter: Router = express.Router();
export const medicalFacilityFeedbackRoutes = getFeedbackRoutes(
	"/medical-facility-feedbacks",
);

feedbackHandler(
	medicalFacilityFeedbackRouter,
	medicalFacilityFeedbackRoutes,
	getAppCtx().facilityFeedbackRepository,
);

// Medical Facility Received Feedbacks
receivedFeedbackHandler(
	router,
	routes.receivedFeedbacks(),
	getAppCtx().facilityReceivedFeedbackRepository,
	"facility",
);
