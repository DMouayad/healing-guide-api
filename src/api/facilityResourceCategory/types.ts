import { commonZodSchemas } from "@common/zod/common";
import { z } from "zod";

export type FacilityResourceCategory = {
	id: number;
	name: string;
};

export const FacilityResourceCategoryZodSchema = z.object({
	id: commonZodSchemas.id,
	name: z.string(),
});
