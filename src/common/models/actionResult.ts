import type { IProvidesApiResponse } from "@/interfaces/IProvidesApiResponse";
import { StatusCodes } from "http-status-codes";
import { z } from "zod";
import type { ApiResponse, ClassProperties } from "../types";
import type AppError from "./appError";

export type ActionResultProps = ClassProperties<ActionResult>;
export abstract class ActionResult implements IProvidesApiResponse {
	public readonly statusCode: number;

	constructor(props: ActionResultProps) {
		this.statusCode = props.statusCode;
	}
	toApiResponse(): ApiResponse {
		let response: ApiResponse;
		if (this instanceof SuccessActionResult) {
			response = { data: this.responseObject };
		} else if (this instanceof FailureActionResult) {
			response = { appError: this.error };
		}
		response ??= {};
		return response;
	}

	static success(props?: Partial<ClassProperties<SuccessActionResult>>) {
		return new SuccessActionResult({
			statusCode:
				(props?.statusCode ?? props?.responseObject === undefined)
					? StatusCodes.NO_CONTENT
					: StatusCodes.OK,
			responseObject: props?.responseObject,
		});
	}

	static failure(props: Partial<ActionResultProps> & { error: AppError }): ActionResult {
		return new FailureActionResult({
			statusCode: props?.statusCode ?? StatusCodes.INTERNAL_SERVER_ERROR,
			error: props.error,
		});
	}
}

class SuccessActionResult extends ActionResult {
	public readonly responseObject?: object;
	constructor(props: ActionResultProps & { responseObject?: object }) {
		super(props);
		this.responseObject = props.responseObject;
	}
}
class FailureActionResult extends ActionResult {
	public readonly error: AppError;
	constructor(props: ActionResultProps & { error: AppError }) {
		super(props);
		this.error = props.error;
	}
}

export const ActionResultSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
	z.object({
		responseObject: dataSchema.optional(),
		statusCode: z.number(),
	});
