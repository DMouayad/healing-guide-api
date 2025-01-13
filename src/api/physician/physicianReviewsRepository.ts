import { db } from "@db/index";
import { handleDBErrors } from "@db/utils";
import { objectToCamel } from "ts-case-convert";
import type {
	CreatePhysicianReviewDTO,
	PhysicianReview,
	UpdatePhysicianReviewDTO,
} from "./PhysicianReview";

export interface IPhysicianReviewsRepository {
	getAllById(id: number): Promise<PhysicianReview[]>;
	store(dto: CreatePhysicianReviewDTO): Promise<PhysicianReview>;
	update(dto: UpdatePhysicianReviewDTO): Promise<PhysicianReview>;
	deleteReview(params: {
		physicianId: number;
		reviewerId: number;
		reviewId: number;
	}): Promise<void>;
}
export class DBPhysicianReviewsRepository implements IPhysicianReviewsRepository {
	getAllById(id: number): Promise<PhysicianReview[]> {
		return db
			.selectFrom("physician_reviews")
			.where("physician_id", "=", id)
			.selectAll()
			.execute()
			.then((results) => results.map(objectToCamel));
	}
	store(dto: CreatePhysicianReviewDTO): Promise<PhysicianReview> {
		return db
			.insertInto("physician_reviews")
			.values({
				physician_id: dto.physicianId,
				review_text: dto.reviewText,
				reviewer_id: dto.reviewerId,
				review_stars: dto.reviewStars,
				reviewer_name: dto.reviewerName,
			})
			.returningAll()
			.executeTakeFirstOrThrow()
			.then(objectToCamel);
	}
	async update(dto: UpdatePhysicianReviewDTO): Promise<PhysicianReview> {
		return await db
			.updateTable("physician_reviews")
			.where("physician_id", "=", dto.physicianId)
			.where("id", "=", dto.reviewId)
			.where("reviewer_id", "=", dto.reviewerId)
			.$if(dto.reviewStars != null, (qb) => qb.set("review_stars", dto.reviewStars!))
			.$if(dto.reviewerName != null, (qb) => qb.set("reviewer_name", dto.reviewerName!))
			.$if(dto.reviewText != null, (qb) => qb.set("review_text", dto.reviewText!))
			.returningAll()
			.executeTakeFirstOrThrow()
			.catch(handleDBErrors)
			.then(objectToCamel);
	}
	async deleteReview(params: {
		physicianId: number;
		reviewerId: number;
		reviewId: number;
	}): Promise<void> {
		await db
			.deleteFrom("physician_reviews")
			.where("physician_id", "=", params.physicianId)
			.where("id", "=", params.reviewId)
			.where("reviewer_id", "=", params.reviewerId)
			.execute();
	}
}
