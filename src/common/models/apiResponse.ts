import type { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ClassProperties } from "../types";
import type AppError from "./appError";
import type { AppErrCode } from "./errorCodes";

/**
 * A standardized API response.
 */
export default abstract class ApiResponse {
	constructor(statusCode: number) {
		this.#statusCode = statusCode;
	}
	readonly #statusCode: number;
	get statusCode() {
		return this.#statusCode;
	}
	isSuccess(): this is SuccessApiResponse {
		return this instanceof SuccessApiResponse;
	}
	isError(): this is ErrorApiResponse {
		return this instanceof ErrorApiResponse;
	}

	static success(params?: { statusCode?: number; data?: object }): SuccessApiResponse {
		return new SuccessApiResponse(params?.statusCode, params?.data);
	}

	static error(error: AppError): ErrorApiResponse {
		return new ErrorApiResponse(error);
	}
	static rateLimited(props: { retryAfterSecs?: number } = {}): RateLimitedApiResponse {
		return new RateLimitedApiResponse(props);
	}

	/**
	 * Sends this object as a JSON response using the provided Express `Response` object.
	 * @param res - Express `Response` object to use.
	 */
	send(res: Response): void {
		res.status(this.statusCode).json(this);
	}
}

export class SuccessApiResponse extends ApiResponse {
	constructor(
		statusCode?: number,
		readonly data?: object,
	) {
		const _statusCode = statusCode ?? (data ? StatusCodes.OK : StatusCodes.NO_CONTENT);
		super(_statusCode);
	}
}

export class ErrorApiResponse extends ApiResponse {
	constructor(error: AppError) {
		super(error.statusCode);
		const message = error.statusCode === 500 ? "Internal Server Error" : error.message;
		const description = error.description;
		const errCode = error.errCode;
		this.error = { message, description, errCode };
	}
	public readonly error?: {
		message: string;
		description?: string;
		errCode: AppErrCode;
	};
}

export class RateLimitedApiResponse extends ApiResponse {
	readonly retryAfterSecs?: number;
	constructor(props: { retryAfterSecs?: number }) {
		super(StatusCodes.TOO_MANY_REQUESTS);
		this.retryAfterSecs = props.retryAfterSecs;
	}
	override send(res: Response): void {
		res.status(this.statusCode);
		if (this.retryAfterSecs) {
			res.setHeader("Retry-After", this.retryAfterSecs);
		}
		res.send("Too Many Requests");
	}
}
