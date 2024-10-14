import type { IUser } from "@/interfaces/IUser";

export abstract class IUserEvent {
	constructor(public readonly user: IUser) {}
	abstract handler(): void;
}
export class UserRegisteredEvent extends IUserEvent {
	override handler(): void {
		throw new Error("Method not implemented.");
	}
	static override name = "userEvent.registered";
}
export class UserVerifiedEvent extends IUserEvent {
	override handler(): void {
		throw new Error("Method not implemented.");
	}
	static override name = "userEvent.verified";
}

export const USER_EVENTS = [UserRegisteredEvent.name, UserVerifiedEvent.name] as const;
