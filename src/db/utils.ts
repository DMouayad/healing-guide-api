import { promises as fs } from "node:fs";
import * as path from "node:path";
import { PG_ERR_CODE } from "@/common/constants";
import AppError from "@/common/models/appError";
import { logger } from "@/common/utils/logger";
import {
	FileMigrationProvider,
	type MigrationResultSet,
	Migrator,
	NO_MIGRATIONS,
	sql,
} from "kysely";
import { DatabaseError as PgDatabaseError } from "pg";
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
	if (results?.length === 0) {
		logger.info("Migration skipped: no new migrations found");
	}
	if (results) {
		for (const it of results) {
			if (it.status === "Success") {
				logger.info(`SUCCESS: migration-${it.direction} "${it.migrationName}"`);
			} else if (it.status === "Error") {
				logger.error(`FAILURE: migration-${it.direction} "${it.migrationName}"`);
			}
		}
	}

	if (error) {
		logger.error("failed to migrate");
		logger.error(error);
	}
}
export async function migrateDBDown() {
	const migrator = getMigratorInstance();
	handleMigrationResult(await migrator.migrateDown());
}
export async function migrateRollbackAll() {
	const migrator = getMigratorInstance();
	handleMigrationResult(await migrator.migrateTo(NO_MIGRATIONS));
}
export async function migrateDBUp() {
	const migrator = getMigratorInstance();
	handleMigrationResult(await migrator.migrateUp());
}
export async function migrateDBLatest() {
	const migrator = getMigratorInstance();
	handleMigrationResult(await migrator.migrateToLatest());
}

export function handleDBErrors(err: any) {
	if (err instanceof PgDatabaseError) {
		switch (err.code) {
			case PG_ERR_CODE.DUPLICATE_VALUE:
				return Promise.reject(AppError.RESOURCE_ALREADY_EXISTS());
		}
	}
	return Promise.reject(err);
}
