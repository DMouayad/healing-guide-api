import { ZodError } from "zod";
import AppError from "../models/appError";
import { APP_ERR_CODES } from "../models/errorCodes";

export function toAppError(err: any): AppError {
	if (isZodError(err)) {
		return AppError.VALIDATION({ message: JSON.stringify(err.format()) });
	}
	if (isAppErr(err)) {
		err.stack = refineStackTrace(err.stack);
		return err;
	}
	const errStatusCode = err.status || err.statusCode || 500;
	const errMessage = errStatusCode === 500 ? "Internal Server Error" : err.message;
	return new AppError(
		errMessage,
		errStatusCode,
		errStatusCode === 500 ? APP_ERR_CODES.SERVER : APP_ERR_CODES.UNKNOWN,
	);
}
function refineStackTrace(trace: string | undefined) {
	if (trace) {
		const stackTraceLines: string[] | undefined = trace.split("\n");
		return stackTraceLines?.slice(3).join("\n");
	}
}
function isAppErr(err: any): err is AppError {
	return err instanceof AppError || (err as AppError).errCode !== undefined;
}
function isZodError(err: any) {
	return err instanceof ZodError;
}
