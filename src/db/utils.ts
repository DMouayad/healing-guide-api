import { promises as fs } from "node:fs";
import * as path from "node:path";
import { logger } from "@/common/utils/logger";
import { FileMigrationProvider, type MigrationResultSet, Migrator, sql } from "kysely";
import { db } from ".";

export async function testDBConnection() {
	await sql`select 1+1 as success`.execute(db);
	logger.info("DB connection success");
}
function getMigratorInstance() {
	return new Migrator({
		db,
		allowUnorderedMigrations: true,
		provider: new FileMigrationProvider({
			fs,
			path,
			migrationFolder: path.join(__dirname, "migrations"),
		}),
	});
}
function handleMigrationResult(resultSet: MigrationResultSet) {
	const { error, results } = resultSet;

	results?.forEach((it) => {
		if (it.status === "Success") {
			logger.info(`migration-${it.direction} "${it.migrationName}" was executed successfully`);
		} else if (it.status === "Error") {
			logger.error(`failed to execute migration "${it.migrationName}"`);
		}
	});

	if (error) {
		logger.error("failed to migrate");
		logger.error(error);
		process.exit(1);
	}
}
export async function migrateDBDown() {
	const migrator = getMigratorInstance();
	handleMigrationResult(await migrator.migrateDown());
}
export async function migrateDBUp() {
	const migrator = getMigratorInstance();
	handleMigrationResult(await migrator.migrateUp());
}
export async function migrateDBLatest() {
	const migrator = getMigratorInstance();
	handleMigrationResult(await migrator.migrateToLatest());
}
