import type { SimplePaginationParams } from "@/common/types";
import { db } from "@/db";
import { handleDBErrors } from "@/db/utils";
import { objectToCamel, objectToSnake } from "ts-case-convert";
import type {
	CreatePhysicianFeedbackCategoryDTO,
	CreatePhysicianFeedbackQuestionDTO,
	PhysicianFeedback,
	PhysicianFeedbackCategory,
	PhysicianFeedbackQuestion,
	UpdatePhysicianFeedbackCategoryDTO,
	UpdatePhysicianFeedbackQuestionDTO,
} from "./types";

export interface IPhysicianFeedbackRepository {
	getAll(params: SimplePaginationParams): Promise<PhysicianFeedback[]>;
	storeCategory(
		dto: CreatePhysicianFeedbackCategoryDTO,
	): Promise<PhysicianFeedbackCategory>;
	updateCategory(
		id: number,
		dto: UpdatePhysicianFeedbackCategoryDTO,
	): Promise<PhysicianFeedbackCategory>;
	deleteCategory(id: number): Promise<void>;
	storeQuestion(
		dto: CreatePhysicianFeedbackQuestionDTO,
	): Promise<PhysicianFeedbackQuestion>;
	updateQuestion(
		id: number,
		dto: UpdatePhysicianFeedbackQuestionDTO,
	): Promise<PhysicianFeedbackQuestion>;
	deleteQuestion(id: number): Promise<void>;
}

export class DBPhysicianFeedbackRepository implements IPhysicianFeedbackRepository {
	storeQuestion(
		dto: CreatePhysicianFeedbackQuestionDTO,
	): Promise<PhysicianFeedbackQuestion> {
		return db
			.insertInto("physician_feedback_questions")
			.values(objectToSnake(dto))
			.returningAll()
			.executeTakeFirstOrThrow()
			.catch(handleDBErrors)
			.then(objectToCamel);
	}
	updateQuestion(
		id: number,
		dto: UpdatePhysicianFeedbackQuestionDTO,
	): Promise<PhysicianFeedbackQuestion> {
		return db
			.updateTable("physician_feedback_questions")
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
			.deleteFrom("physician_feedback_questions")
			.where("id", "=", id)
			.executeTakeFirstOrThrow();
	}
	async getAll(params: SimplePaginationParams): Promise<PhysicianFeedback[]> {
		return db.transaction().execute(async (trx) => {
			const questions = await trx
				.selectFrom("physician_feedback_questions")
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
				.selectFrom("physician_feedback_categories")
				.where("id", "in", categoryIds)
				.select(["id as category_id", "name"])
				.execute();
			// Create a map for efficient question lookup by category ID
			const questionsByCategoryId: Record<number, PhysicianFeedbackQuestion[]> = {};
			for (const question of questions) {
				if (!questionsByCategoryId[question.category_id]) {
					questionsByCategoryId[question.category_id] = [];
				}
				questionsByCategoryId[question.category_id].push(objectToCamel(question));
			}

			// Combine categories and questions
			const result: PhysicianFeedback[] = categories.map((category) => ({
				...objectToCamel(category),
				questions: questionsByCategoryId[category.category_id] || [], // Use empty array if no questions
			}));
			return result;
		});
	}

	updateCategory(
		id: number,
		dto: UpdatePhysicianFeedbackCategoryDTO,
	): Promise<PhysicianFeedbackCategory> {
		const q = db.updateTable("physician_feedback_categories").where("id", "=", id);
		if (dto.name) {
			q.set("name", dto.name);
		}
		if (dto.parentCategoryId) {
			q.set("parent_category_id", dto.parentCategoryId);
		}
		return q.returningAll().executeTakeFirstOrThrow().catch(handleDBErrors);
	}
	storeCategory(
		dto: CreatePhysicianFeedbackCategoryDTO,
	): Promise<PhysicianFeedbackCategory> {
		return db
			.insertInto("physician_feedback_categories")
			.values(objectToSnake(dto))
			.returningAll()
			.executeTakeFirstOrThrow()
			.catch(handleDBErrors);
	}
	async deleteCategory(id: number): Promise<void> {
		await db
			.deleteFrom("physician_feedback_categories")
			.where("id", "=", id)
			.executeTakeFirstOrThrow();
	}
}
