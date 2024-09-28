export interface IUser {
	id: string;
	activated: boolean;
	full_name: string;
	email: string;
	password_hash: string;
	phone_number: string;
	email_verified_at: Date | null;
	phone_number_verified_at: Date | null;
	created_at: Date;
}
