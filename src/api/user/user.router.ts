import { signedURL } from "@/middleware/signedURL";
import express, { type Router } from "express";
import { activated } from "../auth/middlewares/activated";
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

userRouter.delete("/me", authenticated, deleteUserAction);

/* Admin Routes */
userRouter.get("/", isAdmin, getNonAdminUsersAction);
userRouter.post("/:id/activate", isAdmin, updateUserActivationStatus(true));
userRouter.post("/:id/deactivate", isAdmin, updateUserActivationStatus(false));

/** End of Admin Routes */
// ======================== Email Verification ==================================
userRouter.get("/email/verify/:id", signedURL, verifyEmailAction);
userRouter.post("/email/verify/resend-notice", authenticated, resendEmailVerificationAction);
// ======================== End of Email Verification ===========================
