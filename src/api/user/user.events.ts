import { IAppEvent } from "@/common/types";
import type { IUser } from "@/interfaces/IUser";

export abstract class IUserEvent extends IAppEvent {
	constructor(
		public readonly user: IUser,
		name: string,
	) {
		super(name);
	}
}
export class UserRegisteredEvent extends IUserEvent {
	override handler(): void {}
	constructor(user: IUser) {
		super(user, USER_EVENTS.registered);
	}
}
export class UserVerifiedEvent extends IUserEvent {
	override handler(): void {}
	constructor(user: IUser) {
		super(user, USER_EVENTS.verified);
	}
}

export const USER_EVENTS = {
	registered: "userEvent.registered",
	verified: "userEvent.verified",
} as const;
