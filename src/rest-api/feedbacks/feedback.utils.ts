export type FeedbackCRUDRoutes = {
	readonly baseRoute: string;
	readonly getAll: "";
	readonly addCategory: "/categories";
	readonly addQuestion: "/questions";
	readonly deleteCategory: (id?: string) => string;
	readonly editCategory: (id?: string) => string;
	readonly deleteQuestion: (id?: string) => string;
	readonly editQuestion: (id?: string) => string;
};
export function getFeedbackRoutes(baseRoute: string): FeedbackCRUDRoutes {
	return {
		baseRoute: baseRoute,
		getAll: "",
		addCategory: "/categories",
		addQuestion: "/questions",
		deleteCategory: (id = ":id") => `/categories/${id}`,
		editCategory: (id = ":id") => `/categories/${id}`,
		deleteQuestion: (id = ":id") => `/questions/${id}`,
		editQuestion: (id = ":id") => `/questions/${id}`,
	} as const;
}
