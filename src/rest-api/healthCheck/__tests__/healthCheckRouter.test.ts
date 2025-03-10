import { StatusCodes } from "http-status-codes";
import request from "supertest";

import type ApiResponse from "src/common/models/apiResponse";
import { app } from "src/server";

describe("Health Check API endpoints", () => {
	it("GET / - success", async () => {
		const response = await request(app).get("/health-check");
		const result: ApiResponse = response.body;

		expect(response.statusCode).toEqual(StatusCodes.OK);
		expect(result.data).toBeNull();
	});
});
