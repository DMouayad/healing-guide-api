import { db } from "@/db";
import { objectToCamel } from "ts-case-convert";
import type {
	PhysicianFeedbackWithUserResponses,
	PhysicianReceivedFeedback,
} from "../physicianFeedback/types";

export interface IPhysicianReceivedFeedbackRepository {
	getPhysicianFeedbackWithUserResponses(
		physicianId: number,
		userId?: number,
	): Promise<PhysicianFeedbackWithUserResponses[]>;
	create(feedback: PhysicianReceivedFeedback): Promise<void>;
	updateFeedbackResponse(
		feedback: PhysicianReceivedFeedback,
	): Promise<PhysicianReceivedFeedback>;
}
export class DBPhysicianReceivedFeedbackRepository
	implements IPhysicianReceivedFeedbackRepository
{
	async getPhysicianFeedbackWithUserResponses(
		physicianId: number,
		userId?: number,
	): Promise<PhysicianFeedbackWithUserResponses[]> {
		const query = db
			.selectFrom("physician_feedback_questions as pfq") // Start from questions
			.innerJoin("physician_feedback_categories as c", "pfq.category_id", "c.id")
			.leftJoin("physician_feedback_categories as pc", "c.parent_category_id", "pc.id")
			.leftJoin("physicians_received_feedbacks as prf", (join) =>
				join
					.onRef("pfq.id", "=", "prf.question_id")
					.on("prf.physician_id", "=", physicianId),
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
					.filterWhere("prf.physician_id", "=", physicianId)
					.as("total_responses_count"),
			)
			.select(({ fn }) =>
				fn
					.countAll<number>("prf")
					.filterWhere("prf.physician_id", "=", physicianId)
					.filterWhere("prf.response", "=", true)
					.as("positive_response_count"),
			)
			.$if(userId != null, (qb) => qb.select("prf.response as user_response"))

			.orderBy(["c.id", "pfq.id"])
			.groupBy(["c.id", "pfq.id", "prf.response"]);
		const results = await query.execute();

		const feedbacksMap = new Map<number, PhysicianFeedbackWithUserResponses>();

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
	async create(feedback: PhysicianReceivedFeedback): Promise<void> {
		await db
			.insertInto("physicians_received_feedbacks")
			.values({
				physician_id: feedback.physicianId,
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
	async updateFeedbackResponse(
		feedback: PhysicianReceivedFeedback,
	): Promise<PhysicianReceivedFeedback> {
		return await db
			.updateTable("physicians_received_feedbacks")
			.where("physician_id", "=", feedback.physicianId)
			.where("question_id", "=", feedback.questionId)
			.where("user_id", "=", feedback.userId)
			.set("response", feedback.response)
			.returningAll()
			.executeTakeFirstOrThrow()

			.then((res) => objectToCamel(res));
	}
}
