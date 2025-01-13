import type { SimplePaginationParams } from "@common/types";
import { db } from "@db/index";
import { handleDBErrors } from "@db/utils";
import type { Language } from "./language.types";

export interface ILanguageRepository {
	store(name: string): Promise<Language>;
	update(id: number, params: { name: string }): Promise<Language>;
	delete(id: number): Promise<void>;
	getAll(params: SimplePaginationParams): Promise<Language[]>;
}
export class DBLanguageRepository implements ILanguageRepository {
	store(name: string): Promise<Language> {
		return db
			.insertInto("languages")
			.values({ name })
			.returningAll()
			.executeTakeFirstOrThrow()
			.catch(handleDBErrors);
	}
	update(id: number, params: { name: string }): Promise<Language> {
		return db
			.updateTable("languages")
			.where("id", "=", id)
			.set("name", params.name)
			.returningAll()
			.executeTakeFirstOrThrow()
			.catch(handleDBErrors);
	}
	async delete(id: number): Promise<void> {
		await db.deleteFrom("languages").where("id", "=", id).executeTakeFirst();
	}
	getAll(params: SimplePaginationParams): Promise<Language[]> {
		return db.selectFrom("languages").selectAll().execute();
	}
}
