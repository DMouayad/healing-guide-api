import { logger } from "@/common/utils/logger";
import { sql } from "kysely";
import { db } from ".";

export async function testDBConnection() {
	// const logger = require("@/common/utils/logger");

	try {
		await sql`select 1+1 as success`.execute(db);
		logger.info("DB connection success");
	} catch (err) {
		// should be handled by the caller
	} finally {
		await db.destroy();
	}
}
