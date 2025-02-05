import { commonZodSchemas } from "src/common/zod/common";
import { z } from "zod";

export type MedicalCondition = { id: number; name: string };

export const MedicalConditionZodSchema = z.object({
	id: commonZodSchemas.id,
	name: z.string(),
});
