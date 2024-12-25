import { PG_ERR_CODE } from "@/common/constants";
import AppError from "@/common/models/appError";
import type { SimplePaginationParams } from "@/common/types";
import { db } from "@/db";
import { DatabaseError as PgDatabaseError } from "pg";
import { objectToSnake } from "ts-case-convert";
import type { PhysicianFeedbackCategory } from "./types";

export interface IPhysicianFeedbackCategoriesRepository {
	getById(id: number): Promise<PhysicianFeedbackCategory | undefined>;
	getAll(params: SimplePaginationParams): Promise<PhysicianFeedbackCategory[]>;
	store(params: {
		name: string;
		parentCategoryId?: number;
	}): Promise<PhysicianFeedbackCategory>;
	update(id: number, params: { name: string }): Promise<PhysicianFeedbackCategory>;
	delete(id: number): Promise<void>;
}

export class DBPhysicianFeedbackCategoriesRepository
	implements IPhysicianFeedbackCategoriesRepository
{
	update(
		id: number,
		params: { name?: string; parentCategoryId?: number },
	): Promise<PhysicianFeedbackCategory> {
		const q = db.updateTable("physician_feedback_categories").where("id", "=", id);
		if (params.name) {
			q.set("name", params.name);
		}
		if (params.parentCategoryId) {
			q.set("parent_category_id", params.parentCategoryId);
		}
		return q.returningAll().executeTakeFirstOrThrow().catch(this.handleDBErrors);
	}
	getById(id: number): Promise<PhysicianFeedbackCategory | undefined> {
		return db
			.selectFrom("physician_feedback_categories")
			.selectAll()
			.where("id", "=", id)
			.executeTakeFirst();
	}
	async getAll(params: SimplePaginationParams): Promise<PhysicianFeedbackCategory[]> {
		return await db.transaction().execute(async (transaction) => {
			return await transaction
				.selectFrom("physician_feedback_categories")
				.orderBy("id", "asc")
				.limit(params.perPage)
				.$if(params.from != null, (qb) => qb.where("id", ">=", params.from))
				.selectAll()
				.execute();
		});
	}
	store(params: {
		name: string;
		parentCategoryId?: number;
	}): Promise<PhysicianFeedbackCategory> {
		return db
			.insertInto("physician_feedback_categories")
			.values(objectToSnake(params))
			.returningAll()
			.executeTakeFirstOrThrow()
			.catch(this.handleDBErrors);
	}
	async delete(id: number): Promise<void> {
		await db
			.deleteFrom("physician_feedback_categories")
			.where("id", "=", id)
			.executeTakeFirstOrThrow();
	}
	handleDBErrors(err: any) {
		if (err instanceof PgDatabaseError) {
			switch (err.code) {
				case PG_ERR_CODE.DUPLICATE_VALUE:
					return Promise.reject(AppError.RESOURCE_ALREADY_EXISTS());
			}
		}
		return Promise.reject(err);
	}
}
