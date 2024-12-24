import cors from "cors";
import express, { Router, type Express } from "express";
import helmet from "helmet";

import { openAPIRouter } from "@/api-docs/openAPIRouter";
import { healthCheckRouter } from "@/api/healthCheck/healthCheckRouter";
import { env } from "@/common/utils/envConfig";

import rateLimiter from "@/middleware/rateLimiter";
import { authRouter } from "./api/auth/authRouter";
import { medicalDepartmentsRouter } from "./api/medicalDepartments/router";
import { medicalSpecialtiesRouter } from "./api/medicalSpecialties/router";
import { userRouter } from "./api/user/user.router";
import { errorHandler, unexpectedRequestHandler } from "./middleware/errorHandler";
import { hasValidContentType } from "./middleware/hasValidContentType";
import { requestLogger } from "./middleware/requestLogger";
import { mailTemplatesRouter } from "./notifications/mailTemplates/router";

const app: Express = express();
// Set the application to trust the reverse proxy
app.set("trust proxy", true);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(helmet());
app.use(rateLimiter());
app.use(requestLogger);

// for every PUT, POST or PATCH request will check if Request has the correct content-type headers
app.use(hasValidContentType);
// End of Middlewares

// Server Health Check endpoints
app.use("/health-check", healthCheckRouter);
// Restful API Routes - latest version
const apiRouter: Router = Router();
app.use(`/api/${env.API_VERSION}`, apiRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/medical-departments", medicalDepartmentsRouter);
apiRouter.use("/medical-specialties", medicalSpecialtiesRouter);

app.use("/mail-templates", mailTemplatesRouter);
// Swagger UI
app.use(openAPIRouter);
// Error handlers
app.use(unexpectedRequestHandler, errorHandler);

export { app };
