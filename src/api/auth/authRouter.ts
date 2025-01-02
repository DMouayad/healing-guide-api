import { Router } from "express";
import {
	confirmIdentityAction,
	createSignupCodeAction,
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
	createSignupCode: "/signup-codes",
} as const;
export const authRouter: Router = Router();
authRouter.post(authRoutes.logout, authenticated, logoutAction);
authRouter.post(authRoutes.signup, signupAction);
authRouter.post(authRoutes.createSignupCode, createSignupCodeAction);
authRouter.post(authRoutes.login, loginAction);

authRouter.post(authRoutes.confirmIdentity, authenticated, confirmIdentityAction);
