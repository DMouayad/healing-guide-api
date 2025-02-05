import { BaseReviewsRepository } from "../reviews/IReviewsRepository";

export class DBFacilityReviewsRepository extends BaseReviewsRepository {
	constructor() {
		super("facility_reviews", "facility_id");
	}
}
