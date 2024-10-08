import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";

import { openAPIRouter } from "@/api-docs/openAPIRouter";
import { healthCheckRouter } from "@/api/healthCheck/healthCheckRouter";
import { env } from "@/common/utils/envConfig";

import rateLimiter from "@/middleware/rateLimiter";
import { apiV1Router } from "./api/routes";
import { errorHandler, unexpectedRequestHandler } from "./middleware/errorHandler";
import { hasRequestBody } from "./middleware/hasRequestBody";
import { hasValidContentType } from "./middleware/hasValidContentType";
import { requestLogger } from "./middleware/requestLogger";

const app: Express = express();

// Set the application to trust the reverse proxy
app.set("trust proxy", true);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(helmet());
app.use(rateLimiter);
app.use(requestLogger);

// for every PUT, POST or PATCH request will check if Request has the correct content-type headers
app.use(hasValidContentType);
// End of Middlewares

// Server Health Check endpoints
app.use("/health-check", healthCheckRouter);
// Restful API Routes - version 1
app.use("/api/v1", apiV1Router);

// Swagger UI
app.use(openAPIRouter);
// Error handlers
app.use(unexpectedRequestHandler, errorHandler);

export { app };
