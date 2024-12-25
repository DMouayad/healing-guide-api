import { z } from "zod";
import { env } from "../utils/envConfig";
import { validatePhoneNo } from "../utils/validators";

const IDSchema = z
	.string()
	.refine((data) => !Number.isNaN(Number(data)), "ID must be a numeric value")
	.transform(Number)
	.refine((num) => num > 0, "ID must be a positive number");
export const commonZodSchemas = {
	id: IDSchema,
	password: z
		.string()
		.refine((value) => value.length >= 8, "Password must be at least 8 characters"),
	phoneNumber: z.string().transform(validatePhoneNo),
	queryParams: z.object({
		perPage: z
			.string()
			.optional()
			.default(env.DEFAULT_PER_PAGE.toString())
			.transform((el) => {
				const parsed = Number.parseInt(el);
				if (Number.isNaN(parsed)) {
					return env.DEFAULT_PER_PAGE;
				}
				return parsed;
			}),
		from: IDSchema.optional().default("1"),
	}),
	requestBodyWithName: z.object({ name: z.string() }),
	requestIdParam: IDSchema,
};
export function z_enumFromArray(array: string[]) {
	return z.enum([array[0], ...array.slice(1)]);
}
export const requestWithIdParamSchema = z.object({ id: commonZodSchemas.id });
export const ZodPaginatedJsonResponse = z.object({
	total: z.number().optional(),
	perPage: z.number(),
	last_page: z.number().nullable(),
	first_page_url: z.string(),
	last_page_url: z.string().nullable(),
	next_page_url: z.string().nullable(),
	prev_page_url: z.string().nullable(),
	from: commonZodSchemas.id.nullable(),
	to: commonZodSchemas.id.nullable(),
	items: z.array(z.object({ id: z.number() })),
});
