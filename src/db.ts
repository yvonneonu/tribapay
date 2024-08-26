import { Kysely, PostgresDialect } from "kysely";
import { Pool } from "pg";

interface Database {
  user: {
    id: number;
    email: string;
    createdAt: Date;
  };
}

const db = new Kysely<Database>({
  dialect: new PostgresDialect({
    pool: new Pool({
      connectionString: process.env.DATABASE_URL,
    }),
  }),
});

export default db;
