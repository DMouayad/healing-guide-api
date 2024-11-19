import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Request, type Response, type Router } from "express";

import { createApiResponses } from "@/api-docs/openAPIResponseBuilders";
import ApiResponse from "@/common/models/apiResponse";
import { StatusCodes } from "http-status-codes";

export const healthCheckRegistry = new OpenAPIRegistry();
export const healthCheckRouter: Router = express.Router();

healthCheckRegistry.registerPath({
	method: "get",
	path: "/health-check",
	tags: ["Health Check"],
	responses: createApiResponses([
		{ statusCode: StatusCodes.NO_CONTENT, description: "Server is healthy" },
		{
			statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
			description: "Server is unhealthy!",
		},
	]),
});

healthCheckRouter.get("/", (_req: Request, res: Response) => {
	ApiResponse.success({ statusCode: StatusCodes.NO_CONTENT }).send(res);
});
