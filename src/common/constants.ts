import { APP_ROLES } from "./types";

export const ASSIGNABLE_ROLES = [
	APP_ROLES.patient,
	APP_ROLES.facilityManager,
	APP_ROLES.physician,
] as const;

export const PG_ERR_CODE = {
	DUPLICATE_VALUE: "23505",
} as const;

export const NOTIFICATIONS = {
	emailVerification: "EMAIL_VERIFICATION_NOTICE",
} as const;
