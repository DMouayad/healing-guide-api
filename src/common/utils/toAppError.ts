import { ZodError } from "zod";
import AppError from "../models/appError";
import { APP_ERR_CODES } from "../models/errorCodes";

export function toAppError(err: any): AppError {
	if (err instanceof ZodError) {
		return AppError.VALIDATION({ message: JSON.stringify(err.format()) });
	}
	if (err instanceof AppError) {
		err.stack = refineStackTrace(err.stack);
		return err;
	}
	return getAppErrorFrom(err);
}
function getAppErrorFrom(err: any): AppError {
	const statusCode = err?.status || err?.statusCode || 500;
	const message = err?.message ?? "Internal Server Error";
	const errCode = statusCode === 500 ? APP_ERR_CODES.SERVER : APP_ERR_CODES.UNKNOWN;
	const appError = new AppError(message, statusCode, errCode);
	appError.stack = err?.stack;
	return appError;
}
function refineStackTrace(trace: string | undefined) {
	if (trace) {
		const stackTraceLines: string[] | undefined = trace.split("\n");
		return stackTraceLines?.slice(3).join("\n");
	}
}
