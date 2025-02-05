import fs from "node:fs";
import { Kysely, PostgresDialect } from "kysely";
import type { DB } from "kysely-codegen";
import { NeonDialect } from "kysely-neon";
import pg, { types } from "pg";
import { env } from "src/common/utils/envConfig";
// Map PG types Int8 and Int4 to number.
pg.types.setTypeParser(types.builtins.INT8, Number.parseInt);
pg.types.setTypeParser(types.builtins.INT4, Number.parseInt);

export const localDbPool = new pg.Pool({ connectionString: getDbURL() });

export const db = new Kysely<DB>({
	dialect: env.isProd
		? new NeonDialect({ connectionString: env.DATABASE_URL })
		: new PostgresDialect({ pool: localDbPool }),
});

export function getDbURL() {
	const {
		POSTGRES_DB,
		POSTGRES_HOST,
		POSTGRES_PORT,
		POSTGRES_USER,
		POSTGRES_PASSWORD_FILE,
	} = env;
	const password = fs.readFileSync(POSTGRES_PASSWORD_FILE, "utf8");

	return `postgres://${POSTGRES_USER}:${password}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`;
}
