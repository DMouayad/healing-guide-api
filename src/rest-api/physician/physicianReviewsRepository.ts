import { BaseReviewsRepository } from "../reviews/IReviewsRepository";

export class DBPhysicianReviewsRepository extends BaseReviewsRepository {
	constructor() {
		super("physician_reviews", "physician_id");
	}
}
