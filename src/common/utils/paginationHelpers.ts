import type { PaginatedJsonResponse } from "../types";
import { parseIntOrNull } from "./numberHelpers";

export function createPaginatedJsonResponse<T>(
	items: T[],
	params: {
		resourceURL: string;
		perPage: number;
		from: number;
		total?: number;
	},
	getItemId?: (item?: T) => number | undefined,
): PaginatedJsonResponse {
	const hasPrevious = params.from !== 1;
	const total = params.total;
	// const hasNext = total && total > items.length;
	const lastPage = total ? total / params.perPage : null;
	function getPageURL(from: number) {
		return `${params.resourceURL}?from=${from}&perPage=${params.perPage}`;
	}
	const fromId = params.from;
	const from = parseIntOrNull(fromId);
	const lastItem = items.at(-1);
	let to = null;
	if (lastItem) {
		const toId = getItemId ? getItemId(lastItem) : (lastItem as any)?.id;
		to = parseIntOrNull(toId);
	}

	const res: PaginatedJsonResponse = {
		total: params.total,
		perPage: params.perPage,
		last_page: lastPage,
		first_page_url: getPageURL(1),
		last_page_url: lastPage ? getPageURL(lastPage * params.perPage) : null,
		next_page_url: to ? getPageURL(to + 1) : null,
		prev_page_url:
			hasPrevious && from
				? getPageURL(from >= params.perPage ? from - params.perPage : 1)
				: null,
		from: from,
		to: to,
		items,
	};
	return res;
}
