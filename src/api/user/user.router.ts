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

userRouter.delete("/me", authenticated, deleteUserAction);

/**======================== Admin Protected Routes ================================== */
userRouter.get("/", authenticated, isAdmin, getNonAdminUsersAction);
userRouter.post("/:id/activate", authenticated, isAdmin, updateUserActivationStatus(true));
userRouter.post("/:id/deactivate", authenticated, isAdmin, updateUserActivationStatus(false));
/**======================== END OF Admin Protected Routes ================================== */

/**======================== Email Verification ================================== */
userRouter.get("/email/verify/:id", signedURL, verifyEmailAction);
userRouter.post("/email/verify/resend-notice", authenticated, resendEmailVerificationAction);
/**======================== END Of Email Verification ================================== */
