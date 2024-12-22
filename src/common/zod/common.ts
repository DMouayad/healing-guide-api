import { z } from "zod";
import { validatePhoneNo } from "../utils/validators";

export const commonZodSchemas = {
	id: z
		.string()
		.refine((data) => !Number.isNaN(Number(data)), "ID must be a numeric value")
		.transform(Number)
		.refine((num) => num > 0, "ID must be a positive number"),
	// ... other common validations
	password: z
		.string()
		.refine((value) => value.length >= 8, "Password must be at least 8 characters"),
	phoneNumber: z.string().transform(validatePhoneNo),
};
export function z_enumFromArray(array: string[]) {
	return z.enum([array[0], ...array.slice(1)]);
}
export const requestWithIdParamSchema = z.object({
	params: z.object({ id: commonZodSchemas.id }),
});
