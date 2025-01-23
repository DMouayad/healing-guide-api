import { commonZodSchemas } from "@/common/zod/common";
import { z } from "zod";

export const FacilityIdParam = z.object({ facilityId: commonZodSchemas.id });
