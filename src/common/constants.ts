import { APP_ROLES } from "./types";

export const ASSIGNABLE_ROLES = [
	APP_ROLES.patient,
	APP_ROLES.facilityManager,
	APP_ROLES.physician,
] as const;

export const PG_ERR_CODE = {
	DUPLICATE_VALUE: "23505",
} as const;

export const HEALING_GUIDE_WEBSITE = "https://dmouayad.github.io/healing-guide-website";
export const IMAGES = {
	logo: {
		name: "App_Logo",
		path: "./src/notifications/mailTemplates/images/logo.png",
	},
} as const;
