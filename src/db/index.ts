import fs from "node:fs";
import { env } from "@/common/utils/envConfig";
import { Kysely, PostgresDialect } from "kysely";
import type { DB } from "kysely-codegen";
import pg, { types } from "pg";
// Map PG types Int8 and Int4 to number.
pg.types.setTypeParser(types.builtins.INT8, Number.parseInt);
pg.types.setTypeParser(types.builtins.INT4, Number.parseInt);

export const db = new Kysely<DB>({
	dialect: new PostgresDialect({
		pool: getDbPool(),
	}),
});
export function getDbPool() {
	return new pg.Pool({
		connectionString: getDbURL(),
	});
}

function getDbURL() {
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
