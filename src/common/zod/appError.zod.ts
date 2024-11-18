import { z } from "zod";
import { APP_ERR_CODES } from "../models/errorCodes";
import { z_enumFromArray } from "./common";

export const ZodAppErrorSchema = z.object({
	message: z.string(),
	description: z.string().optional(),
	errCode: z_enumFromArray(Object.values(APP_ERR_CODES)),
});
