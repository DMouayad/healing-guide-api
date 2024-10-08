import type { IProvidesApiResponse } from "@/interfaces/IProvidesApiResponse";
import { StatusCodes, getReasonPhrase } from "http-status-codes";
import type { ApiResponse } from "../types";
import { APP_ERR_CODES, type AppErrCode } from "./errorCodes";

type ParamsOverride = {
	message?: string;
	description?: string;
};

class AppError extends Error implements IProvidesApiResponse {
	constructor(
		override readonly message: string,
		readonly status: number,
		readonly errCode: AppErrCode,
		readonly description?: string,
	) {
		super();
	}
	toApiResponse(): ApiResponse {
		return {
			appError: this,
		};
	}

	static SERVER_ERROR(params?: ParamsOverride): AppError {
		return constructErr(APP_ERR_CODES.SERVER, StatusCodes.INTERNAL_SERVER_ERROR, params);
	}
	static BAD_REQUEST(params?: ParamsOverride): AppError {
		return constructErr(APP_ERR_CODES.BAD_REQUEST, StatusCodes.BAD_REQUEST, params);
	}
	static UNAUTHORIZED(params?: ParamsOverride): AppError {
		return constructErr(APP_ERR_CODES.UNAUTHORIZED, StatusCodes.UNAUTHORIZED, params);
	}
	static FORBIDDEN(params?: ParamsOverride): AppError {
		return constructErr(APP_ERR_CODES.FORBIDDEN, StatusCodes.FORBIDDEN, params);
	}
	static ROUTE_NOT_FOUND(params?: ParamsOverride): AppError {
		return constructErr(APP_ERR_CODES.ROUTE_NOT_FOUND, StatusCodes.NOT_FOUND, params);
	}
	static ENTITY_NOT_FOUND(params?: ParamsOverride): AppError {
		return constructErr(APP_ERR_CODES.ENTITY_NOT_FOUND, StatusCodes.BAD_REQUEST, params);
	}
	static VALIDATION(params?: ParamsOverride): AppError {
		return constructErr(APP_ERR_CODES.VALIDATION, StatusCodes.BAD_REQUEST, params);
	}
	static UNSUPPORTED_MEDIA_TYPE(params?: ParamsOverride): AppError {
		return constructErr(
			APP_ERR_CODES.INVALID_CONTENT_TYPE,
			StatusCodes.UNSUPPORTED_MEDIA_TYPE,
			params,
		);
	}
	static INVALID_ACCESS_TOKEN(params?: ParamsOverride): AppError {
		return constructErr(APP_ERR_CODES.INVALID_PAT, StatusCodes.UNAUTHORIZED, params);
	}
	static UNVERIFIED_EMAIL_OR_PHONE(params?: ParamsOverride): AppError {
		return constructErr(APP_ERR_CODES.UNVERIFIED_EMAIL_OR_PHONE, StatusCodes.FORBIDDEN);
	}
	static UNVERIFIED_EMAIL_AND_PHONE(params?: ParamsOverride): AppError {
		return constructErr(APP_ERR_CODES.UNVERIFIED_EMAIL_AND_PHONE, StatusCodes.FORBIDDEN);
	}
	static EMPTY_REQUEST_BODY(params?: ParamsOverride): AppError {
		return constructErr(APP_ERR_CODES.EMPTY_REQUEST_BODY, StatusCodes.BAD_REQUEST, {
			message: "Request body cannot be empty!",
			...params,
		});
	}
}
function constructErr(errCode: AppErrCode, status: number, params?: ParamsOverride): AppError {
	return new AppError(
		params?.message ?? getReasonPhrase(status),
		status,
		errCode,
		params?.description,
	);
}

export default AppError;
