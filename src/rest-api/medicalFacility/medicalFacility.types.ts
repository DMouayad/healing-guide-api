import { commonZodSchemas } from "src/common/zod/common";
import { z } from "zod";

export const ZodMedicalFacility = z.object({
	id: commonZodSchemas.id,
	managerId: commonZodSchemas.id,
	facilityTypeId: commonZodSchemas.id,
	name: z.string(),
	address: z.string(),
	location: z.any(), // geometry('POINT', 4326)
	emergencyPhoneNumber: z.string().nullable(),
	appointmentsPhoneNumber: z.string(),
	mobilePhoneNumber: z.string().nullable(),
	avatarUrl: z.string().nullable(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export type MedicalFacility = z.infer<typeof ZodMedicalFacility>;
