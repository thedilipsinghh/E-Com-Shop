import { Config } from "drizzle-kit";
import { env } from "./src/config/env";

export default {
    dialect: "postgresql",
    schema: "./src/db/schema/index.ts",
    out: "./drizzle",
    dbCredentials: {
        url: env.PG_URL,
    },
    migrations: {
        table: "__drizzle_migrations",
        schema: "public"
    }
} satisfies Config;