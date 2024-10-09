import { Router } from "express";
import { authRouter } from "./auth/authRouter";
import { userRouter } from "./user/user.router";

const apiV1Router: Router = Router();
apiV1Router.use("/users", userRouter);
apiV1Router.use("/auth", authRouter);

export { apiV1Router };
