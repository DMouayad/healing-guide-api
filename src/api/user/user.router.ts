import { signedURL } from "@/middleware/signedURL";
import express, { type Router } from "express";
import { authenticated } from "../auth/middlewares/authenticated";
import { isAdmin } from "../auth/middlewares/isAdmin";
import {
	deleteUserAction,
	getNonAdminUsersAction,
	resendEmailVerificationAction,
	updateUserActivationStatus,
	verifyEmailAction,
} from "./user.actions";

export const userRouter: Router = express.Router();

export const userRoutes = {
	index: "/",
	currentUser: "/me",
	updateActivationStatus: (id = ":id") => `/${id}/activation-status`,
	verifyEmail: (id = ":id") => `/${id}/email-verification`,
	resendEmailVerificationNotice: "me/email-verification/resend",
} as const;

userRouter.delete(userRoutes.currentUser, authenticated, deleteUserAction);

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
userRouter.post(userRoutes.verifyEmail(), signedURL, verifyEmailAction);
userRouter.post(
	userRoutes.resendEmailVerificationNotice,
	authenticated,
	resendEmailVerificationAction,
);
/**======================== END Of Email Verification ================================== */
