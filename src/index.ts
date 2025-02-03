import { app } from "@/server";
import { env } from "@utils/envConfig";
import { logger } from "@utils/logger";
import { db } from "./db";
import {
	checkPostgisExtension,
	enablePostGisExtension,
	migrateDBLatest,
	testDBConnection,
} from "./db/utils";

// start Express app
initServer()
	.catch((err) => {
		logger.fatal(`Server initialization failed | ${err}`);
		process.exitCode = 1;
	})
	.then(() => testDBConnection())
	.catch((err) => {
		logger.fatal(`DB connection failed | ${err}`);
		process.exitCode = 1;
	})
	.then(checkPostgisExtension)
	.then((alreadyEnabled) =>
		alreadyEnabled ? Promise.resolve() : enablePostGisExtension(),
	)
	.then(() => migrateDBLatest())
	.then(() => {
		const { NODE_ENV, HOST, PORT } = env;
		logger.info(`Server (${NODE_ENV}) running on port http://${HOST}:${PORT}`);
	});

async function initServer() {
	return await new Promise((resolve) => {
		const server = app.listen(env.PORT);
		server.addListener("close", async () => {
			await db.destroy();
		});
		resolve(true);
	});
}
