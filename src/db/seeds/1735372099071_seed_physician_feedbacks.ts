import type { Kysely } from "kysely";

export async function seed(db: Kysely<any>): Promise<void> {
	const providerCategory = { name: "Provider Feedback" };
	const OfficeAndStaffCategory = { name: "Office and Staff Feedback" };
	const providerQuestions = [
		{ question: "Trusted the provider's decisions" },
		{ question: "Answered all of your questions satisfactorily" },
		{ question: "Appointment wasn't rushed" },
		{ question: "Followed up with you as promised" },
		{ question: "Explained conditions well" },
	];
	const officeAndStaffQuestions = [
		{ question: "Staff was welcoming" },
		{ question: "Waiting times were reasonable" },
		{ question: "The office was clean and comfortable" },
	];

	await db
		.insertInto("physician_feedback_categories")
		.values([providerCategory])
		.returning(["id"])
		.executeTakeFirst()
		.then((result) => {
			if (Number.isInteger(result?.id)) {
				const questionsWithCategory = providerQuestions.map((el) => {
					return { ...el, category_id: result?.id };
				});
				return db
					.insertInto("physician_feedback_questions")
					.values(questionsWithCategory)
					.execute();
			}
		});
	await db
		.insertInto("physician_feedback_categories")
		.values([OfficeAndStaffCategory])
		.returning(["id"])
		.executeTakeFirst()
		.then((result) => {
			const questionsWithCategory = officeAndStaffQuestions.map((el) => {
				return { ...el, category_id: result?.id };
			});
			if (Number.isInteger(result?.id)) {
				return db
					.insertInto("physician_feedback_questions")
					.values(questionsWithCategory)
					.execute();
			}
		});
}
