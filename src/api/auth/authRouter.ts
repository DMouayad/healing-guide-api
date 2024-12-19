import { Router } from "express";
import {
	confirmIdentityAction,
	loginAction,
	logoutAction,
	signupAction,
} from "./auth.actions";
import { authenticated } from "./middlewares/authenticated";
export const authRoutes = {
	signup: "/signup",
	login: "/login",
	logout: "/logout",
	confirmIdentity: "/confirm-identity",
} as const;
export const authRouter: Router = Router();
authRouter.post(authRoutes.logout, authenticated, logoutAction);
authRouter.post(authRoutes.signup, signupAction);
authRouter.post(authRoutes.login, loginAction);

authRouter.post(authRoutes.confirmIdentity, authenticated, confirmIdentityAction);
