import { commonZodSchemas } from "@common/zod/common";
import { z } from "zod";

export const ZodLanguage = z.object({
	id: commonZodSchemas.id,
	name: z.string(),
});
export type Language = typeof ZodLanguage._output;
