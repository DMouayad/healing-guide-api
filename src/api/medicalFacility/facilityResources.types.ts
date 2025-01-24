import { commonZodSchemas } from "@/common/zod/common";
import { z } from "zod";

// Base Schema
export const ZodFacilityResource = z.object({
	id: commonZodSchemas.id,
	facilityId: commonZodSchemas.id,
	categoryId: commonZodSchemas.id,
	title: z.string().nonempty().max(255),
	content: z.string().nonempty(),
});

export type FacilityResource = z.infer<typeof ZodFacilityResource>;

// Create DTO Schema
export const ZodCreateFacilityResourceDTO = ZodFacilityResource.omit({
	id: true,
});

export type CreateFacilityResourceDTO = z.infer<typeof ZodCreateFacilityResourceDTO>;

// Update DTO Schema
export const ZodUpdateFacilityResourceDTO = ZodCreateFacilityResourceDTO.partial();

export type UpdateFacilityResourceDTO = z.infer<typeof ZodUpdateFacilityResourceDTO>;

// Request Params
export const FacilityResourceIdParam = z.object({ resourceId: commonZodSchemas.id });
const FacilityIdParam = z.object({ facilityId: commonZodSchemas.id });
// Request Types
export const FacilityResourcesRequests = {
	getById: {
		params: FacilityResourceIdParam,
	},
	getByFacilityId: {
		params: FacilityIdParam,
	},
	create: {
		params: FacilityIdParam,
		body: ZodCreateFacilityResourceDTO.omit({ facilityId: true }),
	},
	update: {
		params: FacilityResourceIdParam,
		body: ZodUpdateFacilityResourceDTO.omit({ facilityId: true }),
	},
	delete: {
		params: FacilityResourceIdParam,
	},
} as const;
