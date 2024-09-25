import { StatusCodes } from "http-status-codes";
import request from "supertest";

import type { ActionResult } from "@/common/models/actionResult";
import { app } from "@/server";

describe("Health Check API endpoints", () => {
	it("GET / - success", async () => {
		const response = await request(app).get("/health-check");
		const result: ActionResult = response.body;

		expect(response.statusCode).toEqual(StatusCodes.OK);
		expect(result.success).toBeTruthy();
		expect(result.responseObject).toBeNull();
		expect(result.message).toEqual("Service is healthy");
	});
});
