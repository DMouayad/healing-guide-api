import { commonZodSchemas } from "src/common/zod/common";
import { z } from "zod";

export type MedicalProcedure = {
	id: number;
	name: string;
};

export const MedicalProcedureZodSchema = z.object({
	id: commonZodSchemas.id,
	name: z.string(),
});
