import ApiResponse from "@common/models/apiResponse";
import AppError from "@common/models/appError";
import { APP_ERR_CODES } from "@common/models/errorCodes";
import { ZodAppErrorSchema } from "@common/zod/appError.zod";
import { ZodPaginatedJsonResponse } from "@common/zod/common";
import { StatusCodes } from "http-status-codes";
import { type ZodTypeAny, z } from "zod";

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
export const identityConfirmationRequiredResponse = {
	statusCode: StatusCodes.FORBIDDEN,
	description: "Failure: identity confirmation is required",
	schema: ZodAppErrorSchema,
	example: ApiResponse.error(
		AppError.FORBIDDEN({ errCode: APP_ERR_CODES.CONFIRM_IDENTITY }),
	),
};
export const duplicateResourceResponse = (description: string) => {
	return {
		statusCode: StatusCodes.CONFLICT,
		description: description,
		schema: ZodAppErrorSchema,
		example: ApiResponse.error(AppError.RESOURCE_ALREADY_EXISTS()),
	};
};
export const paginatedJsonResponse = (
	description: string,
	resourceSchema: ZodTypeAny,
) => {
	return {
		statusCode: StatusCodes.OK,
		description: description,
		schema: ZodPaginatedJsonResponse.merge(
			z.object({ items: z.array(resourceSchema) }),
		),
	};
};

export const requestIdParam = {
	params: z.object({ id: z.number() }),
};
