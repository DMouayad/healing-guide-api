export function parseIntOrNull(input: any): number | null {
	if (input && Number.isNaN(input)) {
		const parsed = Number.parseInt(input);
		if (Number.isInteger(parsed)) {
			return parsed;
		}
		return null;
	}
	return input;
}
