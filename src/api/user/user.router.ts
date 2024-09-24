import express, { type Router } from "express";

import { validateRequest } from "@/common/utils/httpHandlers";
import { requests } from "./user.model";

export const userRouter: Router = express.Router();

userRouter.route("/:id").get(validateRequest(requests.get)).delete(validateRequest(requests.delete));
