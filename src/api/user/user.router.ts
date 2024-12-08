import rateLimiter from "@/middleware/rateLimiter";
import express, { type Router } from "express";
import { authenticated } from "../auth/middlewares/authenticated";
import { isAdmin } from "../auth/middlewares/isAdmin";
import {
	deleteUserAction,
	getNonAdminUsersAction,
	sendEmailVerificationAction,
	updateUserActivationStatus,
	verifyEmailAction,
} from "./user.actions";

export const userRouter: Router = express.Router();

export const userRoutes = {
	index: "/",
	currentUser: "/me",
	updateActivationStatus: (id = ":id") => `/${id}/activation-status`,
	verifyEmail: "/me/email-verification",
	sendEmailVerification: "/me/email-verification/send",
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
userRouter.post(userRoutes.verifyEmail, authenticated, verifyEmailAction);
userRouter.post(
	userRoutes.sendEmailVerification,
	rateLimiter(3, 15),
	authenticated,
	sendEmailVerificationAction,
);
/**======================== END Of Email Verification ================================== */
