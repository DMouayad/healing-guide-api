import { StatusCodes, getReasonPhrase } from "http-status-codes";
import { APP_ERR_CODES, type AppErrCode } from "./errorCodes";

type ParamsOverride = {
	message?: string;
	description?: string;
};
class AppError {
	constructor(
		readonly message: string,
		readonly status: number,
		readonly errCode: AppErrCode,
		readonly description?: string,
		readonly origin?: Error,
		readonly layer?: string,
	) {}

	static SERVER_ERROR(params?: ParamsOverride): AppError {
		return constructErr(APP_ERR_CODES.SERVER, StatusCodes.INTERNAL_SERVER_ERROR, params);
	}
	static BAD_REQUEST(params?: ParamsOverride): AppError {
		return constructErr(APP_ERR_CODES.BAD_REQUEST, StatusCodes.BAD_REQUEST, params);
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
		return constructErr(APP_ERR_CODES.INVALID_CONTENT_TYPE, StatusCodes.UNSUPPORTED_MEDIA_TYPE, params);
	}
	static EMPTY_REQUEST_BODY(params?: ParamsOverride): AppError {
		return constructErr(APP_ERR_CODES.EMPTY_REQUEST_BODY, StatusCodes.BAD_REQUEST, {
			message: "Request body cannot be empty!",
			...params,
		});
	}
}
function constructErr(errCode: AppErrCode, status: number, params?: ParamsOverride): AppError {
	return {
		errCode,
		...{ message: getReasonPhrase(status), status: status },
		...params,
	};
}

export default AppError;
