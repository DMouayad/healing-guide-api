import { commonZodSchemas } from "@common/zod/common";
import { z } from "zod";

export type FacilityType = {
	id: number;
	name: string;
};

export const FacilityTypeZodSchema = z.object({
	id: commonZodSchemas.id,
	name: z.string(),
});
