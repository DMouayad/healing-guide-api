import { Router } from "express";
import { userRouter } from "./user/user.router";

const apiV1Router: Router = Router();
apiV1Router.use("/users", userRouter);

export { apiV1Router };
