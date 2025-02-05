import { passwordResetRoutes } from "src/passwordReset/passwordReset.router";
import type { ViewName } from "../constants";
import { env } from "./envConfig";

type ScriptMap = Partial<Record<ViewName, string[]>>;
type StyleMap = Partial<Record<ViewName, string[]>>;

const apiPath = `/api/${env.API_VERSION}`;

export default () => {
	return {
		helpers: {
			forgotPasswordApiEndpoint: passwordResetRoutes.forgotPasswordEndpoint,
			requestPasswordResetViaEmailPage: "/forgot-password/email",
			requestPasswordResetViaPhonePage: "/forgot-password/phone",
			pageTitle: (page: ViewName) => {
				switch (page) {
					case "forgot-password":
						return "Forgot Password";
					case "reset-password":
						return "Reset your password";
				}
			},
			inputValue: (context: object | undefined, fieldName: string) => {
				if (context?.fieldName) {
					return context[fieldName];
				}
				return ""; // Return an empty string if the value is undefined or null
			},
			bodyScripts: (page: ViewName) => {
				const scriptMap: ScriptMap = {
					"forgot-password": ["/js/forgot-password.js"],
					"reset-password": [
						"/js/zxcvbn/zxcvbn-ts.js",
						"/js/zxcvbn/zxcvbn-ts-language-common.js",
						"/js/zxcvbn/zxcvbn-ts-language-en.js",
						"/js/reset-password.js",
					],
				};
				return scriptMap[page] || [];
			},
			bodyDeferredScripts: (page: ViewName) => {
				const scriptMap: ScriptMap = {};
				return scriptMap[page] || [];
			},
			bodyAsyncScripts: (page: ViewName) => {
				const scriptMap: ScriptMap = {};
				return scriptMap[page] || [];
			},
			headScripts: (page: ViewName) => {
				const scriptMap: ScriptMap = {};
				return scriptMap[page] || [];
			},
			headAsyncScripts: (page: ViewName) => {
				const scriptMap: ScriptMap = {};
				return scriptMap[page] || [];
			},
			headDeferredScripts: (page: ViewName) => {
				const scriptMap: ScriptMap = {};
				return scriptMap[page] || [];
			},
			styles: (page: ViewName) => {
				const globalStyle = "/css/global.css";
				const styleMap: StyleMap = {
					"forgot-password": [globalStyle],
					"reset-password": [globalStyle],
					"not-found": ["/css/404.css"],
					"password-reset-invalid": [globalStyle],
					"password-reset-success": [globalStyle],
				};
				return styleMap[page];
			},
		},
	};
};
