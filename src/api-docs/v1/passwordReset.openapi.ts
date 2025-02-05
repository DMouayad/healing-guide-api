import type { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { passwordResetRoutes } from "src/passwordReset/passwordReset.router";
import {
	forgotPasswordRequest,
	resetPasswordRequest,
} from "src/passwordReset/passwordReset.types";
import { invalidPasswordResetResponse } from "../common";
import { createApiResponses } from "../openAPIResponseBuilders";

export function registerPasswordResetPaths(registry: OpenAPIRegistry, baseUrl: string) {
	registry.registerPath({
		method: "post",
		path: baseUrl + passwordResetRoutes.forgotPasswordEndpoint,
		description: "Used by user to request a password-reset link ",
		tags: ["Password Reset"],
		request: {
			body: {
				content: {
					"application/json": {
						schema: forgotPasswordRequest.body,
					},
				},
			},
		},
		responses: createApiResponses([]),
	});
	registry.registerPath({
		method: "post",
		path: baseUrl + passwordResetRoutes.resetPassword("{token}"),
		description: "Used by user to change their current password",
		tags: ["Password Reset"],
		request: {
			params: resetPasswordRequest.params,
			body: {
				content: {
					"application/json": {
						schema: resetPasswordRequest.body,
					},
				},
			},
		},
		responses: createApiResponses([invalidPasswordResetResponse]),
	});
}
