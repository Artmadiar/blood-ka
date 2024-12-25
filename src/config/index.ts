import dotenv from "dotenv";
import path from "path";

// force dotenv to load .env file from root directory
// knex migrations are run from another directory
dotenv.config({ path: path.join(__dirname, "../../.env") });

export const config = {
  bot: {
    token: process.env.BOT_TOKEN!,
  },
  database: {
    url: process.env.DATABASE_URL!,
  },
};
