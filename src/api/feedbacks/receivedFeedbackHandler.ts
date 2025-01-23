import ApiResponse from "@/common/models/apiResponse";
import type { Request, Response, Router } from "express";
import { authenticated } from "../auth/middlewares/authenticated";
import { getUserFromResponse } from "../auth/utils";
import type { IReceivedFeedbackRepository } from "./ReceivedFeedbackRepository";
import { receivedFeedbackRequests } from "./types";

export function receivedFeedbackHandler(
	router: Router,
	route: string,
	repository: IReceivedFeedbackRepository,
	type: "physician" | "facility",
) {
	router.post(route, authenticated, createAction);
	router.patch(route, authenticated, updateAction);
	router.get(route, getAction);

	async function createAction(req: Request, res: Response) {
		const user = getUserFromResponse(res);
		const params = receivedFeedbackRequests[type].createOrUpdate.params.parse(
			req.params,
		);
		const body = receivedFeedbackRequests[type].createOrUpdate.body.parse(req.body);
		await repository.create({
			userId: user.id,
			receiverId: params.receiverId,
			questionId: body.questionId,
			response: body.response,
		});
		return ApiResponse.success().send(res);
	}
	async function updateAction(req: Request, res: Response) {
		const user = getUserFromResponse(res);
		const params = receivedFeedbackRequests[type].createOrUpdate.params.parse(
			req.params,
		);
		const body = receivedFeedbackRequests[type].createOrUpdate.body.parse(req.body);
		const updatedFeedback = await repository.updateFeedbackResponse({
			userId: user.id,
			receiverId: params.receiverId,
			questionId: body.questionId,
			response: body.response,
		});
		return ApiResponse.success({ data: updatedFeedback }).send(res);
	}
	async function getAction(req: Request, res: Response) {
		const user = getUserFromResponse(res, false);
		const params = receivedFeedbackRequests[type].get.params.parse(req.params);
		const result = await repository.getFeedbackWithUserResponses(
			params.receiverId,
			user?.id,
		);
		ApiResponse.success({ data: result }).send(res);
	}
}
