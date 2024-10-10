import { APP_ROLES } from "./types";

export const ASSIGNABLE_ROLES = [
	APP_ROLES.patient,
	APP_ROLES.facilityManager,
	APP_ROLES.physician,
] as const;
