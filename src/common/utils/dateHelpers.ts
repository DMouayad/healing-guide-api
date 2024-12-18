export function isNotDate(obj: any) {
	return !(obj instanceof Date);
}
export function dateIsPast(expiresAt: Date): boolean {
	return expiresAt.valueOf() < Date.now();
}
export function getExpiresAt(expirationInMinutes: number) {
	const createdAt = new Date();
	const expiresAt = new Date();
	expiresAt.setTime(createdAt.getTime() + expirationInMinutes * 60000);
	return expiresAt;
}

export function tryParseDate(obj: any): Date | null {
	if (obj instanceof Date) {
		return obj;
	}
	const timestamp = Date.parse(obj);
	if (!Number.isNaN(timestamp)) {
		return new Date(timestamp);
	}
	return null;
}
