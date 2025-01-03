import parsePhoneNumber from "libphonenumber-js";
import { z } from "zod";
import { ASSIGNABLE_ROLES } from "../constants";
import { env } from "../utils/envConfig";

const IDSchema = z
	.string()
	.refine((data) => !Number.isNaN(Number(data)), "ID must be a numeric value")
	.transform(Number)
	.refine((num) => num > 0, "ID must be a positive number");
export const commonZodSchemas = {
	id: IDSchema,
	role: z.string().transform(validateRole),
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
	requestIdParam: z.object({ id: IDSchema }),
	nullableName: z.object({ name: z.string().nullable() }),
};
export function z_enumFromArray(array: string[]) {
	return z.enum([array[0], ...array.slice(1)]);
}
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
	items: z.array(z.any()),
});

function validateRole(value: string, ctx: z.RefinementCtx) {
	const matchingAppRole = ASSIGNABLE_ROLES.find((appRole) => appRole.slug === value);
	if (!matchingAppRole) {
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			message: "Invalid role",
		});
		return z.NEVER;
	}
	return matchingAppRole;
}
function validatePhoneNo(value: string, ctx: z.RefinementCtx) {
	const phoneNumber = parsePhoneNumber(value, {
		defaultCountry: "SY",
	});

	if (!phoneNumber?.isValid()) {
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			message: "Invalid phone number",
		});
		return z.NEVER;
	}

	return phoneNumber.format("INTERNATIONAL", { fromCountry: "SY" });
}
