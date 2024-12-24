import type { PaginatedJsonResponse } from "../types";

export function createPaginatedJsonResponse(
	items: { id: string }[],
	params: {
		resourceURL: string;
		perPage: number;
		from: number;
		total?: number;
	},
): PaginatedJsonResponse {
	const hasPrevious = params.from !== 1;
	const total = params.total;
	// const hasNext = total && total > items.length;
	const lastPage = total ? total / params.perPage : null;
	function getPageURL(from: number) {
		return `${params.resourceURL}?from=${from}&perPage=${params.perPage}`;
	}
	const from = params.from;
	let to: any = items.at(items.length - 1)?.id;
	if (to) {
		to = Number.parseInt(to);
	}

	const res: PaginatedJsonResponse = {
		total: params.total,
		perPage: params.perPage,
		last_page: lastPage,
		first_page_url: getPageURL(1),
		last_page_url: lastPage ? getPageURL(lastPage * params.perPage) : null,
		next_page_url: to ? getPageURL(to + 1) : null,
		prev_page_url: hasPrevious
			? getPageURL(from >= params.perPage ? from - params.perPage : 1)
			: null,
		from: from.toString(),
		to: to.toString(),
		items,
	};
	return res;
}
