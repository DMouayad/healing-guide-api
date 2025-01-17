import { APP_ROLES, type ObjectValues } from "./types";

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
		path: "./src/public/images/logo.png",
	},
} as const;
export const VIEW_TITLES = {
	forgotPassword: "Forgot password",
	resetPassword: "Reset your password",
	notFound: "Page not found",
} as const;
export const VIEW_NAMES = {
	resetPassword: "reset-password",
	forgotPassword: "forgot-password",
	notFound: "not-found",
	passwordResetSuccess: "password-reset-success",
	invalidPasswordResetLink: "password-reset-invalid",
} as const;
export type ViewName = ObjectValues<typeof VIEW_NAMES>;
