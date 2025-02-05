import type { SimplePaginationParams } from "src/common/types";
import { db } from "src/db/index";
import { handleDBErrors } from "src/db/utils";
import { objectToCamel, objectToSnake } from "ts-case-convert";
import type {
	CreateFeedbackCategoryDTO,
	CreateFeedbackQuestionDTO,
	Feedback,
	FeedbackCategory,
	FeedbackQuestion,
	UpdateFeedbackCategoryDTO,
	UpdateFeedbackQuestionDTO,
} from "./types";

export interface IFeedbackRepository {
	getAll(params: SimplePaginationParams): Promise<Feedback[]>;
	storeCategory(dto: CreateFeedbackCategoryDTO): Promise<FeedbackCategory>;
	updateCategory(id: number, dto: UpdateFeedbackCategoryDTO): Promise<FeedbackCategory>;
	deleteCategory(id: number): Promise<void>;
	storeQuestion(dto: CreateFeedbackQuestionDTO): Promise<FeedbackQuestion>;
	updateQuestion(id: number, dto: UpdateFeedbackQuestionDTO): Promise<FeedbackQuestion>;
	deleteQuestion(id: number): Promise<void>;
}

export class DBFeedbackRepository implements IFeedbackRepository {
	constructor(
		readonly questionsTable:
			| "physician_feedback_questions"
			| "facility_feedback_questions",
		readonly categoriesTable:
			| "physician_feedback_categories"
			| "facility_feedback_categories",
	) {}
	storeQuestion(dto: CreateFeedbackQuestionDTO): Promise<FeedbackQuestion> {
		return db
			.insertInto(this.questionsTable)
			.values(objectToSnake(dto))
			.returningAll()
			.executeTakeFirstOrThrow()
			.catch(handleDBErrors)
			.then(objectToCamel);
	}
	updateQuestion(
		id: number,
		dto: UpdateFeedbackQuestionDTO,
	): Promise<FeedbackQuestion> {
		return db
			.updateTable(this.questionsTable)
			.where("id", "=", id)
			.$if(dto.question != null, (qb) => qb.set("question", dto.question!))
			.$if(dto.categoryId != null, (qb) => qb.set("category_id", dto.categoryId!))
			.returningAll()
			.executeTakeFirstOrThrow()
			.catch(handleDBErrors)
			.then(objectToCamel);
	}
	async deleteQuestion(id: number): Promise<void> {
		await db
			.deleteFrom(this.questionsTable)
			.where("id", "=", id)
			.executeTakeFirstOrThrow();
	}
	async getAll(params: SimplePaginationParams): Promise<Feedback[]> {
		return db.transaction().execute(async (trx) => {
			const questions = await trx
				.selectFrom(this.questionsTable)
				.orderBy("id", "asc")
				.limit(params.perPage)
				.$if(params.from != null, (qb) => qb.where("id", ">=", params.from))
				.selectAll()
				.execute();

			if (questions.length === 0) {
				return [];
			}

			const categoryIds = [...new Set(questions.map((q) => q.category_id))];

			const categories = await trx
				.selectFrom(this.categoriesTable)
				.where("id", "in", categoryIds)
				.select(["id as category_id", "name"])
				.execute();
			// Create a map for efficient question lookup by category ID
			const questionsByCategoryId: Record<number, FeedbackQuestion[]> = {};
			for (const question of questions) {
				if (!questionsByCategoryId[question.category_id]) {
					questionsByCategoryId[question.category_id] = [];
				}
				questionsByCategoryId[question.category_id].push(objectToCamel(question));
			}

			// Combine categories and questions
			const result: Feedback[] = categories.map((category) => ({
				...objectToCamel(category),
				questions: questionsByCategoryId[category.category_id] || [], // Use empty array if no questions
			}));
			return result;
		});
	}

	updateCategory(
		id: number,
		dto: UpdateFeedbackCategoryDTO,
	): Promise<FeedbackCategory> {
		const q = db.updateTable(this.categoriesTable).where("id", "=", id);
		if (dto.name) {
			q.set("name", dto.name);
		}
		if (dto.parentCategoryId) {
			q.set("parent_category_id", dto.parentCategoryId);
		}
		return q.returningAll().executeTakeFirstOrThrow().catch(handleDBErrors);
	}
	storeCategory(dto: CreateFeedbackCategoryDTO): Promise<FeedbackCategory> {
		return db
			.insertInto(this.categoriesTable)
			.values(objectToSnake(dto))
			.returningAll()
			.executeTakeFirstOrThrow()
			.catch(handleDBErrors);
	}
	async deleteCategory(id: number): Promise<void> {
		await db
			.deleteFrom(this.categoriesTable)
			.where("id", "=", id)
			.executeTakeFirstOrThrow();
	}
}

export class DBPhysicianFeedbackRepository extends DBFeedbackRepository {
	constructor() {
		super("physician_feedback_questions", "physician_feedback_categories");
	}
}
export class DBFacilityFeedbackRepository extends DBFeedbackRepository {
	constructor() {
		super("facility_feedback_questions", "facility_feedback_categories");
	}
}
