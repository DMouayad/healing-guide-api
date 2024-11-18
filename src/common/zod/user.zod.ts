import { z } from "zod";
import { APP_ROLES } from "../types";
import { validatePhoneNo } from "../utils/validators";
import { z_enumFromArray } from "./common";

export const UserSchema = z.object({
	id: z.number(),
	activated: z.boolean().default(false),
	fullName: z.string(),
	role: z_enumFromArray(Object.keys(APP_ROLES)),
	email: z.string().email(),
	phoneNumber: z.string().transform(validatePhoneNo),
	createdAt: z.string().datetime(),
	emailVerifiedAt: z.string().datetime().optional(),
	phoneNumberVerifiedAt: z.string().datetime().optional(),
});
