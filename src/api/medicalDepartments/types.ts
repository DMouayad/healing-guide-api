import { z } from "zod";

export type MedicalDepartment = {
	id: string;
	name: string;
};

export const MedicalDepartmentZodSchema = z.object({
	id: z.string(),
	name: z.string(),
});
