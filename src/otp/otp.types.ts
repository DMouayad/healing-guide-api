import type { ObjectValues } from "@/common/types";

export const OTP_PURPOSES = {
	emailVerification: "EMAIL_VERIFICATION",
	phoneVerification: "PHONE_VERIFICATION",
	identityConfirmation: "IDENTITY_CONFIRMATION",
	signupConfirmation: "SIGNUP_CONFIRMATION",
} as const;
export type OtpPurpose = ObjectValues<typeof OTP_PURPOSES>;

export type CreateOtpDTO = {
	issuedFor: string;
	purpose: OtpPurpose;
	expirationInMinutes: number;
	length: number;
};
export interface OTP {
	hash: string;
	issuedFor: string;
	purpose: OtpPurpose;
	expiresAt: Date;
}
export type OTPWithCode = OTP & { code: string };
