import { Router } from "express";
import { logoutAction } from "./auth.actions";
import { authenticated } from "./middlewares/authenticated";

export const authRouter: Router = Router();
authRouter.post("/logout", authenticated, logoutAction);
