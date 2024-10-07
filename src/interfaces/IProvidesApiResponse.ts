import type { ApiResponse } from "@/common/types";

export interface IProvidesApiResponse {
	toApiResponse(): ApiResponse;
}
