import { z } from "zod";

export type MedicalProcedure = {
	id: string;
	name: string;
};

export const MedicalProcedureZodSchema = z.object({
	id: z.string(),
	name: z.string(),
});
