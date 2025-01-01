import cors from "cors";
import express, { Router, type Express } from "express";
import helmet from "helmet";

import { openAPIRouter } from "@/api-docs/openAPIRouter";
import { healthCheckRouter } from "@/api/healthCheck/healthCheckRouter";
import { env } from "@/common/utils/envConfig";

import rateLimiter from "@/middleware/rateLimiter";
import { authRouter } from "./api/auth/authRouter";
import { languageRouter } from "./api/languages/language.router";
import { medicalConditionsRouter } from "./api/medicalConditions/router";
import { medicalDepartmentsRouter } from "./api/medicalDepartments/router";
import { medicalProceduresRouter } from "./api/medicalProcedures/router";
import { medicalSpecialtiesRouter } from "./api/medicalSpecialties/router";
import { physicianRouter } from "./api/physician/physician.router";
import { physicianFeedbackRouter } from "./api/physicianFeedback/router";
import { userRouter } from "./api/user/user.router";
import { errorHandler, unexpectedRequestHandler } from "./middleware/errorHandler";
import { hasValidContentType } from "./middleware/hasValidContentType";
import { requestLogger } from "./middleware/requestLogger";
import { mailTemplatesRouter } from "./transactionalEmailTemplates/router";

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
app.use("/mail-templates", mailTemplatesRouter);
app.use(`/api/${env.API_VERSION}`, apiRouter);
apiRouter.use("/users", userRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/medical-departments", medicalDepartmentsRouter);
apiRouter.use("/medical-specialties", medicalSpecialtiesRouter);
apiRouter.use("/medical-procedures", medicalProceduresRouter);
apiRouter.use("/medical-conditions", medicalConditionsRouter);
apiRouter.use("/physician-feedbacks", physicianFeedbackRouter);
apiRouter.use("/physicians", physicianRouter);
apiRouter.use("/languages", languageRouter);
// Swagger UI
app.use(openAPIRouter);
// Error handlers
app.use(unexpectedRequestHandler, errorHandler);

export { app };
