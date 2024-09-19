import { env } from "@/common/utils/envConfig";
import { logger } from "@/common/utils/logger";
import { Kysely, PostgresDialect, sql } from "kysely";
import type { DB } from "kysely-codegen";
import pg from "pg";
const { Pool } = pg;

export const db = new Kysely<DB>({
	dialect: new PostgresDialect({
		pool: new Pool({
			connectionString: env.DATABASE_URL,
		}),
	}),
});

export async function testDBConnection() {
	try {
		await sql`select 1+1 as success`.execute(db);
		logger.info("DB connection success");
	} catch (err) {
		// should be handled by the caller
	} finally {
		await db.destroy();
	}
}
