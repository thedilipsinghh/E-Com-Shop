import { env } from "../config/env";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

const pool = new Pool({
    connectionString: env.PG_URL,
});

export const db = drizzle(pool);

export default db;
