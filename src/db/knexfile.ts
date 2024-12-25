import knexStringcase from "knex-stringcase";
import { config } from "../config";
import { Knex } from "knex";

const knexConfig: Knex.Config = {
  client: "pg",
  connection: config.database.url,
  migrations: {
    directory: "./migrations",
    extension: "ts",
  },
  pool: {
    min: 2,
    max: 10,
  },
  ...knexStringcase(),
};

export default knexConfig;
