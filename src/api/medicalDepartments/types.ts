import { commonZodSchemas } from "@/common/zod/common";
import { z } from "zod";

export type MedicalDepartment = {
	id: number;
	name: string;
};

export const MedicalDepartmentZodSchema = z.object({
	id: commonZodSchemas.id,
	name: z.string(),
});
