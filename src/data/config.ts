import knex from "knex";

export const db = knex({
  client: "sqlite3",
  connection: {
    filename: "data/db.sqlite",
  },

  // sqlite does not support inserting default values
  useNullAsDefault: true,
});
