import "server-only";
import 'dotenv/config';
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as authSchema from "./auth-schema";
import * as billingSchema from "./schema";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
});

// Combine all schemas for the database instance
const schema = {
  ...authSchema,
  ...billingSchema,
};

export const db = drizzle({ client: pool, schema });
