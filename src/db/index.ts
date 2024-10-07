import { Kysely, PostgresDialect } from "kysely";
import type { DB } from "kysely-codegen";
import pg, { types } from "pg";

// Map PG types Int8 and Int4 to number.
pg.types.setTypeParser(types.builtins.INT8, Number.parseInt);
pg.types.setTypeParser(types.builtins.INT4, Number.parseInt);
export const db = new Kysely<DB>({
	dialect: new PostgresDialect({
		pool: new pg.Pool({
			connectionString: process.env.DATABASE_URL,
		}),
	}),
});
