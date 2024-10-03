import type { Role } from "@/common/types";

export abstract class IHasAuthorization {
	readonly role!: Role;
	isAuthorizedAs(role: Role): boolean {
		return role === this.role;
	}
	isAuthorizedAsAny(roles: Role[]): boolean {
		return roles.includes(this.role);
	}
}
