import { APP_ROLES } from "@/common/types";
import { signedURL } from "@/middleware/signedURL";
import express, { type Router } from "express";
import { activated } from "../auth/middlewares/activated";
import { authenticated } from "../auth/middlewares/authenticated";
import { authorized } from "../auth/middlewares/authorized";
import {
	deleteUserAction,
	getNonAdminUsersAction,
	resendEmailVerificationAction,
	updateUserActivationStatus,
	verifyEmailAction,
} from "./user.actions";

export const userRouter: Router = express.Router();
userRouter.use(authenticated, activated);
userRouter.delete("/me", deleteUserAction);
/* Admin Routes */
userRouter.get("/", authorized(APP_ROLES.admin), getNonAdminUsersAction);
userRouter.post(
	"/:id/activate",
	authorized(APP_ROLES.admin),
	updateUserActivationStatus(true),
);
userRouter.post(
	"/:id/deactivate",
	authorized(APP_ROLES.admin),
	updateUserActivationStatus(false),
);

/** End of Admin Routes */
// ======================== Email Verification ==================================
userRouter.get("/email/verify/:id", signedURL, verifyEmailAction);
userRouter.post("/email/verify/resend-notice", authenticated, resendEmailVerificationAction);
// ======================== End of Email Verification ===========================
