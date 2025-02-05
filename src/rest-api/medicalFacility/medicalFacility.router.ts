import express, { type Router } from "express";
import { APP_ROLES } from "src/common/types";
import { getAppCtx } from "src/common/utils/getAppCtx";
import { authenticated } from "../auth/middlewares/authenticated";
import { authorized } from "../auth/middlewares/authorized";
import { getFeedbackRoutes } from "../feedbacks/feedback.utils";
import { feedbackHandler } from "../feedbacks/feedbackHandlers";
import { receivedFeedbackHandler } from "../feedbacks/receivedFeedbackHandler";
import { createReviewActions } from "../reviews/reviews.actions";
import { ReviewRequests } from "../reviews/reviews.types";
import { createFacilityPatientVisitorResourceActions } from "./patientVisitorResource.actions";

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
	patientsAndVisitors: {
		baseRoute: "patient-visitor-resources",
		managerRoutes: {
			index: "/me/patient-visitor-resources",
			byId: (resourceId = ":resourceId") =>
				`/me/patient-visitor-resources/${resourceId}`,
		},
		publicRoutes: {
			getFacilityItems: (facilityId = ":facilityId") =>
				`/${facilityId}/patient-visitor-resources`,
			getByIdAndFacilityId: (facilityId = ":facilityId", resourceId = ":resourceId") =>
				`/${facilityId}/patient-visitor-resources/${resourceId}`,
		},
	},
} as const;

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

// MedicalFacility Reviews
const reviewActions = createReviewActions(
	ReviewRequests.facility,
	getAppCtx().facilityReviewsRepository,
);
router.get(routes.getReviews(), reviewActions.getReviews);
router.post(
	routes.createFacilityReview(),
	authenticated,
	reviewActions.createReviewByUser,
);
router.patch(routes.reviewById(), authenticated, reviewActions.editReview);
router.delete(routes.reviewById(), authenticated, reviewActions.deleteReview);

// MedicalFacility Received Feedbacks
receivedFeedbackHandler(
	router,
	routes.receivedFeedbacks(),
	getAppCtx().facilityReceivedFeedbackRepository,
	"facility",
);

// MedicalFacility Patients and Visitors Resources
const resourceActions = createFacilityPatientVisitorResourceActions();
// Facility Manager routes
router.get(
	routes.patientsAndVisitors.managerRoutes.index,
	authenticated,
	authorized(APP_ROLES.facilityManager),
	resourceActions.getItemsForCurrentUser,
);
router.post(
	routes.patientsAndVisitors.managerRoutes.index,
	authenticated,
	authorized(APP_ROLES.facilityManager),
	resourceActions.create,
);
router.put(
	routes.patientsAndVisitors.managerRoutes.byId(),
	authenticated,
	authorized(APP_ROLES.facilityManager),
	resourceActions.update,
);
router.delete(
	routes.patientsAndVisitors.managerRoutes.byId(),
	authenticated,
	authorized(APP_ROLES.facilityManager),
	resourceActions.delete,
);
// Public Patient-Visitor Resources routes
router.get(
	routes.patientsAndVisitors.publicRoutes.getFacilityItems(),
	resourceActions.getItemsByFacilityId,
);
router.get(
	routes.patientsAndVisitors.publicRoutes.getByIdAndFacilityId(),
	resourceActions.getByIdAndFacilityId,
);

export const medicalFacilityRoutes = routes;
export const medicalFacilityRouter = router;
