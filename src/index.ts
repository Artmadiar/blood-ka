import { Telegraf, session } from "telegraf";
import knex from "knex";
import knexConfig from "./db/knexfile";
import { BotContext } from "./types/context";
import { config } from "./config";
import { GameManager } from "./game/game-manager";
import { PlayerRepository } from "./db/repositories/player.repository";
import { LocationRepository } from "./db/repositories/location.repository";
import { MonsterRepository } from "./db/repositories/monster.repository";
import { MonsterGenerator } from "./game/monster-generator";
import {
  registerStartHandler,
  registerStatusHandler,
  registerLocationHandler,
  // registerShopHandler,
  // registerBattleHandler
} from "./handlers";

const db = knex(knexConfig);

const playerRepository = new PlayerRepository(db);
const locationRepository = new LocationRepository(db);
const gameManager = new GameManager(playerRepository);
const monsterRepository = new MonsterRepository(db);
const monsterGenerator = new MonsterGenerator(monsterRepository);

// Создаем игровой контекст
const gameContext = {
  playerRepository,
  locationRepository,
  gameManager,
  monsterGenerator,
  db,
};

const bot = new Telegraf<BotContext>(config.bot.token);

// Middleware
bot.use(session());

// Добавляем middleware для gameContext ПЕРЕД регистрацией хэндлеров
bot.use((ctx, next) => {
  ctx.gameContext = gameContext;
  return next();
});

registerStartHandler(bot);
registerStatusHandler(bot);
registerLocationHandler(bot);
// registerShopHandler(bot);
// registerBattleHandler(bot);

bot
  .launch()
  .then(() => {
    console.log("Bot started");
  })
  .catch((err) => {
    console.error(err);
  });

// Enable graceful stop
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
