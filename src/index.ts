import { Markup, Telegraf, session } from "telegraf";
import { config } from "./config";
import { GameManager } from "./game/game-manager";
import { PlayerRepository } from "./db/repositories/player.repository";
import { LocationRepository } from "./db/repositories/location.repository";
import { createLocationKeyboard, mainMenuKeyboard } from "./keyboards";
import knex from "knex";
import knexConfig from "./db/knexfile";
import { MonsterRepository } from "./db/repositories/monster.repository";
import { MonsterGenerator } from "./game/monster-generator";
import { COMMANDS } from "./constants/commands";

const db = knex(knexConfig);
const playerRepository = new PlayerRepository(db);
const locationRepository = new LocationRepository(db);
const gameManager = new GameManager(playerRepository);
const monsterRepository = new MonsterRepository(db);
const monsterGenerator = new MonsterGenerator(monsterRepository);

const bot = new Telegraf(config.bot.token);

// Middleware
bot.use(session());

// Start command
bot.command("start", async (ctx) => {
  const { id: telegramId } = ctx.from;
  const name = ctx.from.first_name;

  const player = await gameManager.getOrCreatePlayer(telegramId, name);

  console.log("player", player);

  await ctx.reply(
    `⚔️ Добро пожаловать в игру, ${player.name}!\n\n` +
      `📊 Ваши характеристики:\n` +
      `📈 Уровень: ${player.level}\n` +
      `❤️ HP: ${player.hp}/${player.maxHp}\n` +
      `⚔️ Атака: ${player.attack}\n` +
      `💰 Золото: ${player.gold}\n\n` +
      `Выберите действие:`,
    mainMenuKeyboard
  );
});

// Обработка команды "Осмотреться"
bot.hears(COMMANDS.LOOK_AROUND, async (ctx) => {
  const { id: telegramId } = ctx.from;
  const player = await playerRepository.getPlayer(telegramId);
  if (!player) return;

  console.log("player", player);

  const location = await locationRepository.getLocation(player.location);
  if (!location) return;

  // Если локация безопасная
  if (location.isSafe) {
    return ctx.reply("Здесь безопасно. Монстров нет.");
  }

  // Генерируем монстра
  const monster = await monsterGenerator.generateForLocation(
    location,
    player.level
  );

  if (!monster) {
    return ctx.reply(
      "Вы осмотрелись вокруг. Пока все тихо...",
      createLocationKeyboard(
        location,
        await locationRepository.getConnectedLocations(location.id)
      )
    );
  }

  // Если монстр появился
  const battleMessage =
    `⚔️ Вы встретили монстра!\n\n` +
    `${monster.name}\n` +
    `${monster.description}\n\n` +
    `❤️ HP: ${monster.hp}/${monster.maxHp}\n` +
    `⚔️ Атака: ${monster.attack}\n\n` +
    `Что будете делать?`;

  // Сохраняем информацию о бое
  await knex("active_battles").insert({
    player_id: player.telegramId,
    monster_id: monster.id,
    monster_hp: monster.hp,
  });

  await ctx.reply(
    battleMessage,
    Markup.keyboard([["⚔️ Атаковать", "🏃‍♂️ Сбежать"]]).resize()
  );
});

// Обработка команды "Где я?"
bot.hears(COMMANDS.WHERE_AM_I, async (ctx) => {
  const { id: telegramId } = ctx.from;
  const player = await playerRepository.getPlayer(telegramId);

  if (!player) {
    return ctx.reply("Используйте /start для начала игры.");
  }

  const location = await locationRepository.getLocation(player.location);
  const connectedLocations = await locationRepository.getConnectedLocations(
    player.location
  );

  const locationInfo =
    `📍 Вы находитесь: ${location?.name}\n\n` +
    `📝 ${location?.description}\n\n` +
    `🚪 Доступные пути:\n` +
    connectedLocations.map((loc) => `- ${loc.name}`).join("\n");

  await ctx.reply(
    locationInfo,
    createLocationKeyboard(location!, connectedLocations)
  );
});

// Обработка перемещений
bot.hears(/^[🏰⚠️] (.+)$/, async (ctx) => {
  const locationName = ctx.match[1];
  const { id: telegramId } = ctx.from;

  const player = await playerRepository.getPlayer(telegramId);
  if (!player) return;

  // Находим локацию по имени
  const connectedLocations = await locationRepository.getConnectedLocations(
    player.location
  );
  const targetLocation = connectedLocations.find(
    (loc) => loc.name === locationName
  );

  if (!targetLocation) {
    return ctx.reply("Вы не можете туда попасть.");
  }

  // Перемещаем игрока
  await playerRepository.updatePlayer(telegramId, {
    location: targetLocation.id,
  });

  const locationInfo =
    `🚶‍♂️ Вы перешли в локацию: ${targetLocation.name}\n\n` +
    `📝 ${targetLocation.description}`;

  const newConnectedLocations = await locationRepository.getConnectedLocations(
    targetLocation.id
  );
  await ctx.reply(
    locationInfo,
    createLocationKeyboard(targetLocation, newConnectedLocations)
  );
});

// Обработка статуса
bot.hears(COMMANDS.STATUS, async (ctx) => {
  const { id: telegramId } = ctx.from;
  const player = await playerRepository.getPlayer(telegramId);

  if (!player) {
    return ctx.reply("Произошла ошибка. Используйте /start для начала игры.");
  }

  await ctx.reply(
    `📊 Ваши характеристики:\n` +
      `📈 Уровень: ${player.level}\n` +
      `❤️ HP: ${player.hp}/${player.maxHp}\n` +
      `⚔️ Атака: ${player.attack}\n` +
      `💰 Золото: ${player.gold}\n` +
      `📍 Локация: ${player.location}`,
    mainMenuKeyboard
  );
});

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
