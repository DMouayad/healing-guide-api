import parsePhoneNumber from "libphonenumber-js";
import { z } from "zod";
import { ASSIGNABLE_ROLES } from "../constants";

export function validateRole(value: string, ctx: z.RefinementCtx) {
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
export function validatePhoneNo(value: string, ctx: z.RefinementCtx) {
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

	return phoneNumber.formatInternational();
}
