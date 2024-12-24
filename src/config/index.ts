import dotenv from "dotenv";

dotenv.config();

export const config = {
  bot: {
    token: process.env.BOT_TOKEN!,
  },
  database: {
    url: process.env.DATABASE_URL!,
  },
};
