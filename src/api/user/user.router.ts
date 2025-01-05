import express, { type Router } from "express";
import { authenticated } from "../auth/middlewares/authenticated";
import { isAdmin } from "../auth/middlewares/isAdmin";

import { rateLimiterByIP, rateLimiterByUser } from "@/middleware/rateLimiter";
import { identityConfirmed } from "../auth/middlewares/identityConfirmed";
import {
	deleteUserAction,
	getNonAdminUsersAction,
	updateUserActivationStatus,
} from "./user.actions";
import rateLimiters from "./user.rateLimiters";
import {
	sendEmailVerificationAction,
	sendPhoneVerificationAction,
	verifyEmailAction,
	verifyPhoneAction,
} from "./userVerification.actions";

export const userRouter: Router = express.Router();

export const userRoutes = {
	index: "",
	currentUser: "/me",
	updateActivationStatus: (id = ":id") => `/${id}/activation-status`,
	verifyEmail: "/me/email-verification",
	sendEmailVerification: "/me/email-verification/send",
	verifyPhone: "/me/phone-verification",
	sendPhoneVerification: "/me/phone-verification/send",
} as const;

userRouter.delete(
	userRoutes.currentUser,
	authenticated,
	identityConfirmed,
	deleteUserAction,
);

/**======================== Admin Protected Routes ================================== */
userRouter.get(userRoutes.index, authenticated, isAdmin, getNonAdminUsersAction);
userRouter.patch(
	userRoutes.updateActivationStatus(),
	authenticated,
	isAdmin,
	updateUserActivationStatus,
);
/**======================== END OF Admin Protected Routes ================================== */

/**======================== Email Verification ================================== */
userRouter.post(
	userRoutes.verifyEmail,
	rateLimiterByIP(rateLimiters.verifyEmail.byIP),
	authenticated,
	rateLimiterByUser(rateLimiters.verifyEmail.byUser),
	verifyEmailAction,
);
userRouter.post(
	userRoutes.sendEmailVerification,
	rateLimiterByIP(rateLimiters.sendEmailVerification.byIP),
	authenticated,
	rateLimiterByUser(rateLimiters.sendEmailVerification.byUser),
	sendEmailVerificationAction,
);
/**======================== END Of Email Verification ================================== */
/**======================== Phone Verification ================================== */
userRouter.post(
	userRoutes.verifyPhone,
	rateLimiterByIP(rateLimiters.verifyPhone.byIP),
	authenticated,
	rateLimiterByUser(rateLimiters.verifyPhone.byUser),
	verifyPhoneAction,
);
userRouter.post(
	userRoutes.sendPhoneVerification,
	rateLimiterByIP(rateLimiters.sendPhoneVerification.byIP),
	authenticated,
	rateLimiterByUser(rateLimiters.sendPhoneVerification.byUser),
	sendPhoneVerificationAction,
);
/**======================== END Of Phone Verification ================================== */
