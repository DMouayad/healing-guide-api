import { app } from "@/server";
import { env } from "@utils/envConfig";
import { logger } from "@utils/logger";

import { db } from "./db";
import { migrateDBUp, testDBConnection } from "./db/utils";
// start Express app
initServer()
	.catch((err) => {
		logger.fatal(`Server initialization failed | ${err}`);
	})
	.then(() => testDBConnection())
	.catch((err) => {
		logger.fatal(`DB connection failed | ${err}`);
		process.exit(1);
	})
	.then(() => migrateDBUp())
	.then(() => {
		const { NODE_ENV, HOST, PORT } = env;
		logger.info(`Server (${NODE_ENV}) running on port http://${HOST}:${PORT}`);
	});

async function initServer() {
	return await new Promise((resolve) => {
		// start listening to the server
		const server = app.listen(env.PORT);
		server.addListener("close", async () => {
			await db.destroy();
		});
		resolve(true);
	});
}
