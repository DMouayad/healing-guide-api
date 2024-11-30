import ApiResponse from "@/common/models/apiResponse";
import AppError from "@/common/models/appError";
import { ZodAppErrorSchema } from "@/common/zod/appError.zod";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";

export const unauthenticatedResponse = {
	statusCode: StatusCodes.UNAUTHORIZED,
	description: "Failure: unauthenticated user",
	schema: ZodAppErrorSchema,
	example: ApiResponse.error(AppError.UNAUTHENTICATED()),
};
export const unauthorizedResponse = {
	statusCode: StatusCodes.FORBIDDEN,
	description: "Failure: unauthorized user",
	schema: ZodAppErrorSchema,
	example: ApiResponse.error(AppError.FORBIDDEN()),
};

export const requestIdParam = {
	params: z.object({ id: z.number() }),
};
