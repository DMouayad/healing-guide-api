import cors from "cors";
import express, { type Request, type Response, Router, type Express } from "express";
import helmet from "helmet";

import { openAPIRouter } from "@api-docs/openAPIRouter";
import { healthCheckRouter } from "@api/healthCheck/healthCheckRouter";
import { env } from "@common/utils/envConfig";

import path from "node:path";

import { engine } from "express-handlebars";
import session from "express-session";
import { authRouter } from "./api/auth/authRouter";
import { languageRouter } from "./api/languages/language.router";
import { medicalConditionsRouter } from "./api/medicalConditions/router";
import { medicalDepartmentsRouter } from "./api/medicalDepartments/router";
import { medicalProceduresRouter } from "./api/medicalProcedures/router";
import { medicalSpecialtiesRouter } from "./api/medicalSpecialties/router";
import {
	physicianFeedbackRouter,
	physicianRouter,
} from "./api/physician/physician.router";
import { userRouter } from "./api/user/user.router";
import { defaultRateLimiterByIP } from "./common/rateLimiters";
import { getTrustedProxiesFromEnv } from "./common/utils/getTrustedProxies";
import { errorHandler, handleInvalidPasswordReset } from "./middleware/errorHandler";
import { hasValidContentType } from "./middleware/hasValidContentType";
import { rateLimiterByIP } from "./middleware/rateLimiter";
import { requestLogger } from "./middleware/requestLogger";
import { mailTemplatesRouter } from "./transactionalEmailTemplates/router";

import pgSession from "connect-pg-simple";
import { facilityTypesRouter } from "./api/facilityTypes/router";
import {
	medicalFacilityFeedbackRouter,
	medicalFacilityRouter,
} from "./api/medicalFacility/medicalFacility.router";
import { patientVisitorInfoRouter } from "./api/patientVisitorInfo/router";
import { VIEW_NAMES } from "./common/constants";
import getHandlebarsOptions from "./common/utils/getHandlebarsOptions";
import { logger } from "./common/utils/logger";
import { getDbPool } from "./db";
import handleFlashedZodErrors from "./middleware/handleFlashedZodErrors";
import { passwordResetRouter } from "./passwordReset/passwordReset.router";
const flash = require("connect-flash");

const app: Express = express();
// Set the application to trust the reverse proxy
app.set("trust proxy", getTrustedProxiesFromEnv());

const sessionCookieOpts: session.CookieOptions = {
	// secure: env.NODE_ENV === "production",
	maxAge: 30 * 60 * 1000,
};
app.use(
	session({
		store: new (pgSession(session))({
			pool: getDbPool(),
			tableName: "sessions",
		}),
		secret: env.SESSION_SECRETS,
		resave: false,
		cookie: sessionCookieOpts,
		saveUninitialized: false,
	}),
);

app.use(flash());

app.use(handleFlashedZodErrors);

app.engine("handlebars", engine(getHandlebarsOptions()));
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "./views"));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Middlewares
// check if Request has the correct content-type headers
app.use(hasValidContentType);

app.use(express.urlencoded({ extended: true, limit: env.MAX_REQUEST_SIZE }));
app.use(express.json({ limit: env.MAX_JSON_BODY_SIZE }));
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(helmet());

app.use(requestLogger);
app.use(rateLimiterByIP(defaultRateLimiterByIP));
// End of Middlewares

// Server Health Check endpoints
app.use("/health-check", healthCheckRouter);

// Password Reset
app.use(passwordResetRouter);

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
apiRouter.use("/patient-visitor-info", patientVisitorInfoRouter);
apiRouter.use("/facility-types", facilityTypesRouter);
apiRouter.use("/medical-facility-feedbacks", medicalFacilityFeedbackRouter);
apiRouter.use("/medical-facilities", medicalFacilityRouter);

// Swagger UI
app.use(openAPIRouter);
// 404 page route
app.get("/404", (req, res) => {
	res.render("404", { name: VIEW_NAMES.notFound });
});
// Error handlers
const pageNotFoundHandler = (req: Request, res: Response) => {
	logger.warn(`${req.method} Request made to unknown route: ${req.url}`);
	if (req.accepts("html")) {
		res.render("404", { name: VIEW_NAMES.notFound });
	} else {
		res.status(404).send("Not Found!");
	}
};
app.use(pageNotFoundHandler, handleInvalidPasswordReset, errorHandler);

export { app };
