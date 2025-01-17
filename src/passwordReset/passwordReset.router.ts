import { VIEW_NAMES } from "@/common/constants";
import {
	forgotPasswordRateLimiterByCreds,
	passwordResetRateLimiterByToken,
	rateLimiterByIP,
} from "@/middleware/rateLimiter";
import { Router } from "express";
import { forgotPasswordAction, resetPasswordAction } from "./passwordReset.actions";
import { passwordResetRateLimits as rateLimits } from "./passwordReset.rateLimits";
import { passwordResetUrlSignature } from "./passwordReset.utils";

const router: Router = Router();

const routes = {
	forgotPasswordEndpoint: "/forgot-password",
	resetPassword: (token = ":token") => `/reset-password/${token}`,
	forgotPasswordStart: "/forgot-password/start",
	forgotPasswordEnd: "/forgot-password/end",
	forgotPasswordViaEmail: "/forgot-password/email",
	forgotPasswordViaPhone: "/forgot-password/phone",
	passwordResetSuccess: "/reset-password-success",
	passwordResetInvalid: "/reset-password-invalid",
};

router.post(
	routes.forgotPasswordEndpoint,
	rateLimiterByIP(rateLimits.forgotPassword.byIP),
	forgotPasswordRateLimiterByCreds(rateLimits.forgotPassword.byCredentials),
	forgotPasswordAction,
);

router.post(
	routes.resetPassword(),
	rateLimiterByIP(rateLimits.resetPassword.byIP),
	passwordResetRateLimiterByToken(rateLimits.resetPassword.byCredentials),
	passwordResetUrlSignature.verifier(),
	resetPasswordAction,
);
// views routes

router.get(routes.forgotPasswordStart, (req, res) => {
	res.render("forgot-password", { name: VIEW_NAMES.forgotPassword });
});
router.get(routes.forgotPasswordViaEmail, (req, res) => {
	res.render("forgot-password-email", { name: VIEW_NAMES.forgotPassword });
});
router.get(routes.forgotPasswordViaPhone, (req, res) => {
	res.render("forgot-password-phone", { name: VIEW_NAMES.forgotPassword });
});

router.get(routes.resetPassword(), passwordResetUrlSignature.verifier(), (req, res) => {
	res.render("reset-password", {
		name: VIEW_NAMES.resetPassword,
	});
});
router.get(routes.forgotPasswordEnd, (req, res) => {
	//@ts-ignore
	const emailOrPhone = req.flash("forgotPassword.identifier");
	if (emailOrPhone.length === 1) {
		res.locals.emailOrPhone = emailOrPhone;
		res.render("forgot-password-end", { name: VIEW_NAMES.forgotPassword });
	} else {
		res.redirect("404");
	}
});
router.get(routes.passwordResetSuccess, (req, res) => {
	res.render("password-reset-success", { name: VIEW_NAMES.passwordResetSuccess });
});

router.get(routes.passwordResetInvalid, (req, res) => {
	res.render("password-reset-invalid", { name: VIEW_NAMES.invalidPasswordResetLink });
});

export const passwordResetRouter = router;
export const passwordResetRoutes = routes;
