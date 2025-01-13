import { commonZodSchemas } from "@common/zod/common";
import { z } from "zod";

export type MedicalSpecialty = { id: number; name: string };

export const MedicalSpecialtyZodSchema = z.object({
	id: commonZodSchemas.id,
	name: z.string(),
});
