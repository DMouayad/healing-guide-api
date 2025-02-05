import { db } from "src/db";
import type { IUser } from "src/interfaces/IUser";
import type { SignupCode } from "src/rest-api/auth/auth.types";
import { getSignupCodeUniqueIdentifier } from "src/rest-api/auth/utils";
import { type OTP, OTP_PURPOSES, type OtpPurpose } from "./otp.types";

export type OtpFilter = { unexpiredOnly: boolean };
export const DefaultFilter: OtpFilter = { unexpiredOnly: false };
export abstract class IOtpRepository {
	abstract find(
		issuedFor: string,
		purpose: OtpPurpose,
		filterBy?: OtpFilter,
	): Promise<OTP | undefined>;

	findSignupCode(
		signupCode: SignupCode,
		filterBy: OtpFilter = DefaultFilter,
	): Promise<OTP | undefined> {
		return this.find(
			getSignupCodeUniqueIdentifier(signupCode),
			OTP_PURPOSES.signupConfirmation,
			filterBy,
		);
	}
	async findEmailVerification(
		user: IUser,
		filterBy: OtpFilter = DefaultFilter,
	): Promise<OTP | undefined> {
		return this.find(user.id.toString(), OTP_PURPOSES.emailVerification, filterBy);
	}
	async findPhoneVerification(
		user: IUser,
		filterBy: OtpFilter = DefaultFilter,
	): Promise<OTP | undefined> {
		return this.find(user.id.toString(), OTP_PURPOSES.phoneVerification, filterBy);
	}
	async findIdentityConfirmation(
		user: IUser,
		filterBy: OtpFilter = DefaultFilter,
	): Promise<OTP | undefined> {
		return this.find(user.id.toString(), OTP_PURPOSES.identityConfirmation, filterBy);
	}
	abstract store(otp: OTP): Promise<OTP>;
	abstract delete(issuedFor: string, purpose: OtpPurpose): Promise<void>;
}

export class DBOtpRepository extends IOtpRepository {
	async delete(issuedFor: string, purpose: OtpPurpose): Promise<void> {
		await db
			.deleteFrom("otps")
			.where("issued_for", "=", issuedFor)
			.where("purpose", "=", purpose)
			.execute();
	}
	async find(
		issuedFor: string,
		purpose: OtpPurpose,
		filterBy = DefaultFilter,
	): Promise<OTP | undefined> {
		return db
			.selectFrom("otps")
			.selectAll()
			.where("issued_for", "=", issuedFor)
			.where("purpose", "=", purpose)
			.$if(filterBy.unexpiredOnly, (qb) => qb.where("expires_at", "<", new Date()))
			.executeTakeFirst()
			.then(this.otpFromQueryResult);
	}
	async store(otp: OTP): Promise<OTP> {
		//src/ts-ignore
		return db
			.insertInto("otps")
			.values({
				expires_at: otp.expiresAt,
				hash: otp.hash,
				issued_for: otp.issuedFor,
				purpose: otp.purpose,
			})
			.returningAll()
			.executeTakeFirstOrThrow()
			.then(this.otpFromQueryResult);
	}
	otpFromQueryResult(object?: {
		issued_for: string;
		expires_at: Date;
		hash: string;
		purpose: string;
	}): OTP | undefined {
		if (object) {
			const purpose = Object.values(OTP_PURPOSES).find((el) => el === object.purpose);
			return purpose
				? {
						hash: object.hash,
						issuedFor: object.issued_for,
						expiresAt: object.expires_at,
						purpose,
					}
				: undefined;
		}
	}
}
