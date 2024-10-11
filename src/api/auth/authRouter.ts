import { Router } from "express";
import { loginAction, logoutAction, signupAction } from "./auth.actions";
import { authenticated } from "./middlewares/authenticated";

export const authRouter: Router = Router();
authRouter.post("/logout", authenticated, logoutAction);
authRouter.post("/signup", signupAction);
authRouter.post("/login", loginAction);
