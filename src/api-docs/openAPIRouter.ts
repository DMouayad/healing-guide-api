import express, { type Request, type Response, type Router } from "express";
import swaggerUi from "swagger-ui-express";

import { generateV1OpenAPIDocument } from "@api-docs/v1/openAPIDocumentGenerator";

export const openAPIRouter: Router = express.Router();
const openAPIDocument = generateV1OpenAPIDocument();

openAPIRouter.get("/swagger.json", (_req: Request, res: Response) => {
	res.setHeader("Content-Type", "application/json");
	res.send(openAPIDocument);
});

openAPIRouter.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openAPIDocument));
