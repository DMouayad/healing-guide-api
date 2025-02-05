import { db } from "src/db/index";
import { handleDBErrors } from "src/db/utils";
import { objectToCamel } from "ts-case-convert";
import type { CreateReviewDTO, Review, UpdateReviewDTO } from "./reviews.types";

export interface IReviewsRepository {
	getAllById(id: number): Promise<Review[]>;
	store(dto: CreateReviewDTO): Promise<Review>;
	update(dto: UpdateReviewDTO): Promise<Review>;
	deleteReview(params: {
		reviewerId: number;
		reviewId: number;
		reviewedId: number;
	}): Promise<void>;
}

export abstract class BaseReviewsRepository implements IReviewsRepository {
	protected constructor(
		protected readonly tableName: "physician_reviews" | "facility_reviews",
		protected readonly entityIdColumn: "physician_id" | "facility_id",
	) {}

	getReviewFromQueryResult(result: {
		id: number;
		physician_id: number;
		facility_id: number;
		review_stars: number | null;
		review_text: string;
		reviewer_id: number;
		reviewer_name: string | null;
		written_at: Date;
	}): Review {
		return {
			id: result.id,
			reviewedId: result.facility_id ?? result.physician_id,
			reviewerId: result.reviewer_id,
			reviewerName: result.reviewer_name,
			reviewStars: result.review_stars,
			reviewText: result.review_text,
			writtenAt: result.written_at,
		};
	}

	getAllById(id: number): Promise<Review[]> {
		return db
			.selectFrom(this.tableName)
			.where(this.entityIdColumn, "=", id)
			.selectAll()
			.execute()
			.then((results) => results.map(this.getReviewFromQueryResult));
	}

	store(dto: CreateReviewDTO): Promise<Review> {
		const values = {
			review_text: dto.reviewText,
			reviewer_id: dto.reviewerId,
			review_stars: dto.reviewStars,
			reviewer_name: dto.reviewerName,
			[this.entityIdColumn]: dto.reviewedId,
		};

		return db
			.insertInto(this.tableName)
			.values(values)
			.returning([
				`${this.entityIdColumn} as reviewedId`,
				"id",
				"review_stars",
				"review_text",
				"reviewer_id",
				"reviewer_name",
				"written_at",
			])
			.executeTakeFirstOrThrow()
			.then(objectToCamel);
	}

	async update(dto: UpdateReviewDTO): Promise<Review> {
		const qb = db
			.updateTable(this.tableName)
			.where(this.entityIdColumn, "=", dto.reviewedId)
			.where("id", "=", dto.id)
			.where("reviewer_id", "=", dto.reviewerId);

		if (dto.reviewStars != null) qb.set("review_stars", dto.reviewStars);
		if (dto.reviewerName != null) qb.set("reviewer_name", dto.reviewerName);
		if (dto.reviewText != null) qb.set("review_text", dto.reviewText);

		return qb
			.returningAll()
			.executeTakeFirstOrThrow()
			.catch(handleDBErrors)
			.then(this.getReviewFromQueryResult);
	}

	async deleteReview(params: {
		reviewerId: number;
		reviewId: number;
		reviewedId: number;
	}): Promise<void> {
		await db
			.deleteFrom(this.tableName)
			.where(this.entityIdColumn, "=", params.reviewedId)
			.where("id", "=", params.reviewId)
			.where("reviewer_id", "=", params.reviewerId)
			.execute();
	}
}
