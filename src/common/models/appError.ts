import { StatusCodes, getReasonPhrase } from "http-status-codes";
import { APP_ERR_CODES, type AppErrCode } from "./errorCodes";

type ParamsOverride = {
	message?: string;
	description?: string;
	errCode?: AppErrCode;
};

class AppError extends Error {
	constructor(
		override readonly message: string,
		readonly statusCode: number,
		readonly errCode: AppErrCode,
		readonly description?: string,
	) {
		super();
	}

	static SERVER_ERROR(params?: ParamsOverride): AppError {
		return constructErr(
			APP_ERR_CODES.SERVER,
			StatusCodes.INTERNAL_SERVER_ERROR,
			params,
		);
	}
	static BAD_REQUEST(params?: ParamsOverride): AppError {
		return constructErr(APP_ERR_CODES.BAD_REQUEST, StatusCodes.BAD_REQUEST, params);
	}
	static UNAUTHENTICATED(params?: ParamsOverride): AppError {
		return constructErr(
			APP_ERR_CODES.UNAUTHENTICATED,
			StatusCodes.UNAUTHORIZED,
			params,
		);
	}
	static FORBIDDEN(params?: ParamsOverride): AppError {
		return constructErr(APP_ERR_CODES.FORBIDDEN, StatusCodes.FORBIDDEN, params);
	}
	static ROUTE_NOT_FOUND(params?: ParamsOverride): AppError {
		return constructErr(APP_ERR_CODES.ROUTE_NOT_FOUND, StatusCodes.NOT_FOUND, params);
	}
	static ACCOUNT_NOT_FOUND(params?: ParamsOverride): AppError {
		return constructErr(
			APP_ERR_CODES.ACCOUNT_NOT_FOUND,
			StatusCodes.UNAUTHORIZED,
			params,
		);
	}
	static ACCOUNT_ALREADY_EXISTS(params?: ParamsOverride): AppError {
		return constructErr(
			APP_ERR_CODES.ACCOUNT_ALREADY_EXISTS,
			StatusCodes.CONFLICT,
			params,
		);
	}
	static ENTITY_NOT_FOUND(params?: ParamsOverride): AppError {
		return constructErr(APP_ERR_CODES.ENTITY_NOT_FOUND, StatusCodes.NOT_FOUND, params);
	}
	static VALIDATION(params?: ParamsOverride): AppError {
		return constructErr(APP_ERR_CODES.VALIDATION, StatusCodes.BAD_REQUEST, params);
	}
	static EXPIRED_OTP(params?: ParamsOverride): AppError {
		return constructErr(APP_ERR_CODES.EXPIRED_OTP, StatusCodes.GONE, params);
	}
	static EMAIL_ALREADY_VERIFIED(params?: ParamsOverride): AppError {
		return constructErr(
			APP_ERR_CODES.EMAIL_ALREADY_VERIFIED,
			StatusCodes.UNPROCESSABLE_ENTITY,
			params,
		);
	}
	static PHONE_ALREADY_VERIFIED(params?: ParamsOverride): AppError {
		return constructErr(
			APP_ERR_CODES.PHONE_ALREADY_VERIFIED,
			StatusCodes.UNPROCESSABLE_ENTITY,
			params,
		);
	}
	static PHONE_NUMBER_ALREADY_VERIFIED(params?: ParamsOverride): AppError {
		return constructErr(
			APP_ERR_CODES.PHONE_NUMBER_ALREADY_VERIFIED,
			StatusCodes.UNPROCESSABLE_ENTITY,
			params,
		);
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
		return constructErr(
			APP_ERR_CODES.UNVERIFIED_EMAIL_AND_PHONE,
			StatusCodes.FORBIDDEN,
		);
	}
	static WRONG_LOGIN_CREDS(params?: ParamsOverride): AppError {
		return constructErr(APP_ERR_CODES.WRONG_LOGIN_CREDS, StatusCodes.UNAUTHORIZED);
	}
	static SIGNUP_FAILED(params?: ParamsOverride): AppError {
		return constructErr(APP_ERR_CODES.SIGNUP_FAILED, StatusCodes.UNAUTHORIZED);
	}
	static EMPTY_REQUEST_BODY(params?: ParamsOverride): AppError {
		return constructErr(APP_ERR_CODES.EMPTY_REQUEST_BODY, StatusCodes.BAD_REQUEST, {
			message: "Request body cannot be empty!",
			...params,
		});
	}
}
function constructErr(
	errCode: AppErrCode,
	status: number,
	params?: ParamsOverride,
): AppError {
	return new AppError(
		params?.message ?? getReasonPhrase(status),
		status,
		params?.errCode ?? errCode,
		params?.description,
	);
}

export default AppError;
