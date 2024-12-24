import { z } from "zod";

export type MedicalSpecialty = {
	id: string;
	name: string;
};

export const MedicalSpecialtyZodSchema = z.object({
	id: z.string(),
	name: z.string(),
});
