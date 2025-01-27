import { commonZodSchemas } from "@/common/zod/common";
import { z } from "zod";

export const PatientVisitorResourceCategorySchema = z.object({
	id: commonZodSchemas.id,
	name: z.string().min(1),
	description: z.string().nullable(),
	iconName: z.string().optional().nullable(),
});

const createCategoryDto = PatientVisitorResourceCategorySchema.omit({ id: true });
const updateCategoryDto = createCategoryDto
	.partial()
	.refine((data) => Object.keys(data).length > 0, {
		message: "At least one field must be provided for update",
	});

export type PatientVisitorResourceCategory = z.infer<
	typeof PatientVisitorResourceCategorySchema
>;
export type CreatePatientVisitorResourceCategoryDTO = z.infer<typeof createCategoryDto>;
export type UpdatePatientVisitorResourceCategoryDTO = z.infer<typeof updateCategoryDto>;
export const PatientVisitorResourceCategorySchemas = {
	create: createCategoryDto,
	update: updateCategoryDto,
};

//

export const PatientVisitorResourceStatus = ["published", "pending"] as const;

export const ZodPatientVisitorResourceStatus = z.enum(PatientVisitorResourceStatus);

// Base Schema
export const ZodPatientVisitorResource = z.object({
	id: commonZodSchemas.id,
	facilityId: commonZodSchemas.id,
	categoryId: commonZodSchemas.id,
	title: z.string().nonempty().max(255),
	content: z.string().nonempty(),
	summary: z.string().nullable(),
	createdAt: z.date(),
	updatedAt: z.date(),
	publishedAt: z.date().nullable(),
	status: ZodPatientVisitorResourceStatus,
});

export const ZodPatientVisitorResourcePreview = ZodPatientVisitorResource.pick({
	id: true,
	categoryId: true,
	title: true,
	updatedAt: true,
});
export type ZodPatientVisitorResourcePreview = z.infer<
	typeof ZodPatientVisitorResourcePreview
>;

export type PatientVisitorResource = z.infer<typeof ZodPatientVisitorResource>;

// Create DTO Schema
export const ZodCreatePatientVisitorResourceDTO = ZodPatientVisitorResource.omit({
	id: true,
}).merge(z.object({ managerId: commonZodSchemas.id }));

export type CreatePatientVisitorResourceDTO = z.infer<
	typeof ZodCreatePatientVisitorResourceDTO
>;

// Update DTO Schema
export const ZodUpdatePatientVisitorResourceDTO =
	ZodCreatePatientVisitorResourceDTO.partial()
		.omit({ facilityId: true })
		.required({ managerId: true });

export type UpdatePatientVisitorResourceDTO = z.infer<
	typeof ZodUpdatePatientVisitorResourceDTO
>;

export const ZodPatientVisitorResourceGroupedByCategory = z.object({
	categoryId: commonZodSchemas.id,
	categoryName: z.string(),
	items: z.array(ZodPatientVisitorResourcePreview),
});
export type PatientVisitorResourceGroupedByCategory = z.infer<
	typeof ZodPatientVisitorResourceGroupedByCategory
>;
