import { commonZodSchemas } from "@/common/zod/common";
import { z } from "zod";

export const PatientVisitorInfoCategorySchema = z.object({
	id: commonZodSchemas.id,
	name: z.string().min(1),
	description: z.string().optional(),
	iconName: z.string().optional().nullable(),
});

const createCategoryDto = PatientVisitorInfoCategorySchema.omit({ id: true });
const updateCategoryDto = createCategoryDto
	.partial()
	.refine((data) => Object.keys(data).length > 0, {
		message: "At least one field must be provided for update",
	});

export type PatientVisitorInfoCategory = z.infer<
	typeof PatientVisitorInfoCategorySchema
>;
export type CreatePatientVisitorInfoCategoryDTO = z.infer<typeof createCategoryDto>;
export type UpdatePatientVisitorInfoCategoryDTO = z.infer<typeof updateCategoryDto>;
export const PatientVisitorInfoCategorySchemas = {
	create: createCategoryDto,
	update: updateCategoryDto,
};
