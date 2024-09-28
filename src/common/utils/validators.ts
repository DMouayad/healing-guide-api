import parsePhoneNumber from "libphonenumber-js";
import { z } from "zod";

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
