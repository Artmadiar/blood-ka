import { Telegraf } from "telegraf";
import { BotContext } from "../types/context";
import { COMMANDS } from "../constants/commands";
import { createLocationKeyboard, mainMenuKeyboard } from "../keyboards";

export function registerLocationHandler(bot: Telegraf<BotContext>) {
  // Обработка команды "Исследовать"
  bot.hears(COMMANDS.EXPLORE, async (ctx) => {
    const { id: telegramId } = ctx.from;
    const { playerRepository, locationRepository } = ctx.gameContext;

    const player = await playerRepository.getPlayer(telegramId);
    if (!player) return;

    const location = await locationRepository.getLocation(player.location);
    const connectedLocations = await locationRepository.getConnectedLocations(
      player.location
    );

    const message =
      `🗺 Куда вы хотите пойти?\n\n` +
      `Текущая локация: ${location?.name}\n` +
      `Доступные пути:\n` +
      connectedLocations
        .map(
          (loc) =>
            `${loc.isSafe ? "🏰" : "⚠️"} ${loc.name} - ${loc.description}`
        )
        .join("\n");

    await ctx.reply(
      message,
      createLocationKeyboard(location!, connectedLocations)
    );
  });

  // Обработка команды "Где я?"
  bot.hears(COMMANDS.WHERE_AM_I, async (ctx) => {
    const { id: telegramId } = ctx.from;
    const { playerRepository, locationRepository } = ctx.gameContext;

    const player = await playerRepository.getPlayer(telegramId);
    if (!player) return;

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

  // Обработка команды "Вернуться в город"
  bot.hears(COMMANDS.RETURN_TO_TOWN, async (ctx) => {
    const { id: telegramId } = ctx.from;
    const { playerRepository, locationRepository } = ctx.gameContext;

    const player = await playerRepository.getPlayer(telegramId);
    if (!player) return;

    await playerRepository.updatePlayer(telegramId, { location: "0-0" });
    const townLocation = await locationRepository.getLocation("0-0");

    await ctx.reply(
      `🏰 Вы вернулись в город.\n\n` + `${townLocation?.description}`,
      mainMenuKeyboard
    );
  });

  // Обработка перехода в локацию
  bot.hears(/^[🏰⚠️] (.+)$/, async (ctx) => {
    console.log("Movement handler triggered");
    console.log("Full message:", ctx.message.text);
    console.log("Match:", ctx.match);

    const locationName = ctx.match[1];
    const { id: telegramId } = ctx.from;
    const { playerRepository, locationRepository } = ctx.gameContext;

    console.log("Trying to move to:", locationName);

    const player = await playerRepository.getPlayer(telegramId);
    if (!player) return;

    console.log("Current player location:", player.location);

    const connectedLocations = await locationRepository.getConnectedLocations(
      player.location
    );
    console.log("Connected locations:", connectedLocations);

    const targetLocation = connectedLocations.find(
      (loc) => loc.name === locationName
    );
    console.log("targetLocation:", targetLocation);

    if (!targetLocation) {
      return ctx.reply("Вы не можете туда попасть.");
    }

    await playerRepository.updatePlayer(telegramId, {
      location: targetLocation.id,
    });

    const locationInfo =
      `🚶‍♂️ Вы перешли в локацию: ${targetLocation.name}\n\n` +
      `📝 ${targetLocation.description}`;

    const newConnectedLocations =
      await locationRepository.getConnectedLocations(targetLocation.id);
    await ctx.reply(
      locationInfo,
      createLocationKeyboard(targetLocation, newConnectedLocations)
    );
  });
}
