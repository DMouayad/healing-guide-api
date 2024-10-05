import { Kysely, PostgresDialect } from "kysely";
import type { DB } from "kysely-codegen";
import pg, { types } from "pg";

const int8TypeId = 20;
// Map int8 to number.
pg.types.setTypeParser(int8TypeId, (val) => {
	return Number.parseInt(val, 10);
});
pg.types.setTypeParser(types.builtins.INT4, (val) => {
	return Number.parseInt(val, 10);
});
export const db = new Kysely<DB>({
	dialect: new PostgresDialect({
		pool: new pg.Pool({
			connectionString: process.env.DATABASE_URL,
		}),
	}),
});
