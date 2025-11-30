import { Pool } from "pg";
import "dotenv/config";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined. Please check your .env file.");
}

const shouldUseSSL = (() => {
  if (typeof process.env.PG_SSL === "string") {
    return process.env.PG_SSL.toLowerCase() === "true";
  }
  return /sslmode=require/i.test(process.env.DATABASE_URL);
})();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: shouldUseSSL ? { rejectUnauthorized: false } : false,
});

pool.on("error", (err) => {
  console.error("Unexpected PostgreSQL error", err);
  process.exit(-1);
});

export default pool;
