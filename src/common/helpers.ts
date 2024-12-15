export function isNotADate(obj: any) {
	return !(obj instanceof Date);
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
