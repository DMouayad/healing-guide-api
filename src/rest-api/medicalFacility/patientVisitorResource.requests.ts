import { commonZodSchemas } from "src/common/zod/common";
import { z } from "zod";
import {
	ZodCreatePatientVisitorResourceDTO,
	ZodUpdatePatientVisitorResourceDTO,
} from "../patientVisitorResource/types";

// Request Params
export const PatientVisitorResourceIdParam = z.object({
	resourceId: commonZodSchemas.id,
});
const FacilityIdParam = z.object({ facilityId: commonZodSchemas.id });
// Request Types
export const PatientVisitorResourcesRequests = {
	getById: {
		params: PatientVisitorResourceIdParam,
	},
	getByIdAndFacilityId: {
		params: PatientVisitorResourceIdParam.merge(FacilityIdParam),
	},
	getByFacilityId: {
		params: FacilityIdParam,
	},
	create: {
		body: ZodCreatePatientVisitorResourceDTO.omit({
			managerId: true,
			facilityId: true,
		}),
	},
	update: {
		params: PatientVisitorResourceIdParam,
		body: ZodUpdatePatientVisitorResourceDTO.omit({ managerId: true }).refine(
			(data) => Object.keys(data).length > 0,
			{
				message: "At least one field must be provided for update",
			},
		),
	},
	delete: {
		params: PatientVisitorResourceIdParam,
	},
} as const;
