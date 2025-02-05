import { db } from "src/db";
import type { FeedbackWithUserResponses, ReceivedFeedback } from "./types";

export abstract class IReceivedFeedbackRepository {
	abstract getFeedbackWithUserResponses(
		receiverId: number,
		userId?: number,
	): Promise<FeedbackWithUserResponses[]>;
	abstract create(feedback: ReceivedFeedback): Promise<void>;
	abstract updateFeedbackResponse(
		feedback: ReceivedFeedback,
	): Promise<ReceivedFeedback>;
}
abstract class DBReceivedFeedbackRepository extends IReceivedFeedbackRepository {
	extractFeedbackFromQueryResult(
		results: {
			parent_category_id: number | null;
			category_id: number;
			category_name: string;
			question_id: number;
			question_text: string;
			total_responses_count: number;
			positive_response_count: number;
			user_response?: boolean | null | undefined;
		}[],
	): FeedbackWithUserResponses[] {
		const feedbacksMap = new Map<number, FeedbackWithUserResponses>();

		for (const row of results) {
			let feedback = feedbacksMap.get(row.category_id);
			if (!feedback) {
				feedback = {
					name: row.category_name,
					categoryId: row.category_id,
					parentCategoryId: row.parent_category_id,
					questions: [],
				};
				feedbacksMap.set(row.category_id, feedback);
			}

			feedback.questions.push({
				id: row.question_id,
				question: row.question_text,
				categoryId: row.category_id,
				userResponse: row.user_response ?? null,
				totalResponsesCount: row.total_responses_count,
				positiveResponseCount: row.positive_response_count,
			});
		}
		return Array.from(feedbacksMap.values());
	}
}

export class DBPhysicianReceivedFeedbackRepository extends DBReceivedFeedbackRepository {
	async getFeedbackWithUserResponses(
		receiverId: number,
		userId?: number,
	): Promise<FeedbackWithUserResponses[]> {
		const query = db
			.selectFrom("physician_feedback_questions as pfq") // Start from questions
			.innerJoin("physician_feedback_categories as c", "pfq.category_id", "c.id")
			.leftJoin("physician_feedback_categories as pc", "c.parent_category_id", "pc.id")
			.leftJoin("physicians_received_feedbacks as prf", (join) =>
				join
					.onRef("pfq.id", "=", "prf.question_id")
					.on("prf.physician_id", "=", receiverId),
			)
			.select([
				"c.id as category_id",
				"c.name as category_name",
				"c.parent_category_id",
				"pfq.id as question_id",
				"pfq.question as question_text",
			])
			.select(({ fn }) =>
				fn
					.countAll<number>("prf")
					.filterWhere("prf.physician_id", "=", receiverId)
					.as("total_responses_count"),
			)
			.select(({ fn }) =>
				fn
					.countAll<number>("prf")
					.filterWhere("prf.physician_id", "=", receiverId)
					.filterWhere("prf.response", "=", true)
					.as("positive_response_count"),
			)
			.$if(userId != null, (qb) => qb.select("prf.response as user_response"))

			.orderBy(["c.id", "pfq.id"])
			.groupBy(["c.id", "pfq.id", "prf.response"]);
		const results = await query.execute();
		return this.extractFeedbackFromQueryResult(results);
	}
	async create(feedback: ReceivedFeedback): Promise<void> {
		await db
			.insertInto("physicians_received_feedbacks")
			.values({
				physician_id: feedback.receiverId,
				question_id: feedback.questionId,
				response: feedback.response,
				user_id: feedback.userId,
			})
			.onConflict((oc) =>
				oc
					.constraint("physicians_received_feedbacks_unique")
					.doUpdateSet({ response: feedback.response }),
			)
			.executeTakeFirstOrThrow();
	}
	async updateFeedbackResponse(feedback: ReceivedFeedback): Promise<ReceivedFeedback> {
		return await db
			.updateTable("physicians_received_feedbacks")
			.where("physician_id", "=", feedback.receiverId)
			.where("question_id", "=", feedback.questionId)
			.where("user_id", "=", feedback.userId)
			.set("response", feedback.response)
			.returningAll()
			.executeTakeFirstOrThrow()
			.then((res) => {
				return {
					questionId: res.question_id,
					receiverId: res.physician_id,
					response: res.response,
					userId: res.user_id,
				};
			});
	}
}
export class DBFacilityReceivedFeedbackRepository extends DBReceivedFeedbackRepository {
	async getFeedbackWithUserResponses(
		receiverId: number,
		userId?: number,
	): Promise<FeedbackWithUserResponses[]> {
		const query = db
			.selectFrom("facility_feedback_questions as pfq") // Start from questions
			.innerJoin("facility_feedback_categories as c", "pfq.category_id", "c.id")
			.leftJoin("facility_feedback_categories as pc", "c.parent_category_id", "pc.id")
			.leftJoin("facilities_received_feedbacks as prf", (join) =>
				join
					.onRef("pfq.id", "=", "prf.question_id")
					.on("prf.facility_id", "=", receiverId),
			)
			.select([
				"c.id as category_id",
				"c.name as category_name",
				"c.parent_category_id",
				"pfq.id as question_id",
				"pfq.question as question_text",
			])
			.select(({ fn }) =>
				fn
					.countAll<number>("prf")
					.filterWhere("prf.facility_id", "=", receiverId)
					.as("total_responses_count"),
			)
			.select(({ fn }) =>
				fn
					.countAll<number>("prf")
					.filterWhere("prf.facility_id", "=", receiverId)
					.filterWhere("prf.response", "=", true)
					.as("positive_response_count"),
			)
			.$if(userId != null, (qb) => qb.select("prf.response as user_response"))

			.orderBy(["c.id", "pfq.id"])
			.groupBy(["c.id", "pfq.id", "prf.response"]);
		const results = await query.execute();
		return this.extractFeedbackFromQueryResult(results);
	}
	async create(feedback: ReceivedFeedback): Promise<void> {
		await db
			.insertInto("facilities_received_feedbacks")
			.values({
				facility_id: feedback.receiverId,
				question_id: feedback.questionId,
				response: feedback.response,
				user_id: feedback.userId,
			})
			.onConflict((oc) =>
				oc
					.constraint("facilities_received_feedbacks_unique")
					.doUpdateSet({ response: feedback.response }),
			)
			.executeTakeFirstOrThrow();
	}
	async updateFeedbackResponse(feedback: ReceivedFeedback): Promise<ReceivedFeedback> {
		return await db
			.updateTable("facilities_received_feedbacks")
			.where("facility_id", "=", feedback.receiverId)
			.where("question_id", "=", feedback.questionId)
			.where("user_id", "=", feedback.userId)
			.set("response", feedback.response)
			.returningAll()
			.executeTakeFirstOrThrow()
			.then((res) => {
				return {
					questionId: res.question_id,
					receiverId: res.facility_id,
					response: res.response,
					userId: res.user_id,
				};
			});
	}
}
