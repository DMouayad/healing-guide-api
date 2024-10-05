import express, { type Router } from "express";

import { userActions } from "./user.actions";
export const userRouter: Router = express.Router();
// TODO:: ADD MIDDLEWARES: AUTH - VERIFIED
// biome-ignore format: having methods on on line isn't good for readability
userRouter.route("/me")
    .get(userActions.get) //
    .delete(userActions.delete) //
