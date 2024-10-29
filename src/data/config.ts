import type { Knex } from "knex";

export const config: Knex.Config = {
  client: "sqlite3",
  connection: {
    filename: "./db/data/db.sqlite3",
  },
  migrations: {
    directory: "./db/migrations",
  },

  // sqlite does not support inserting default values
  useNullAsDefault: true,
};
