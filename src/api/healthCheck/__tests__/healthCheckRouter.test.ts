import { StatusCodes } from "http-status-codes";
import request from "supertest";

import { app } from "@/server";
import type ApiResponse from "@common/models/apiResponse";

describe("Health Check API endpoints", () => {
	it("GET / - success", async () => {
		const response = await request(app).get("/health-check");
		const result: ApiResponse = response.body;

		expect(response.statusCode).toEqual(StatusCodes.OK);
		expect(result.data).toBeNull();
	});
});
