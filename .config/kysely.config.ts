import { defineConfig } from "kysely-ctl";
import { db } from "../src/db";
export default defineConfig({
	kysely: db,
	migrations: {
		migrationFolder: process.env.MIGRATIONS_FOLDER_PATH,
	},
	seeds: {
		seedFolder: process.env.SEEDS_FOLDER_PATH,
	},
});
