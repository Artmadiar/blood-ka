import { Telegraf } from "telegraf";
import { BotContext } from "../types/context";
import { COMMANDS } from "../constants/commands";
import { createLocationKeyboard, mainMenuKeyboard } from "../keyboards";
import { Location } from "@/types";

export function registerLocationHandler(bot: Telegraf<BotContext>) {
  // Обработка команды "Исследовать"
  bot.hears(COMMANDS.EXPLORE, async (ctx) => {
    const { id: telegramId } = ctx.from;
    const { playerRepository, locationRepository } = ctx.gameContext;

    const player = await playerRepository.getPlayer(telegramId);
    if (!player) return;

    const location = await locationRepository.getLocation(player.location);
    if (!location) return;

    const connectedLocations = await locationRepository.getConnectedLocations(
      player.location
    );

    await ctx.reply(
      formatLocationDescription(location, connectedLocations),
      createLocationKeyboard(location, connectedLocations)
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

  // Обработка перемещений через callback
  bot.action(new RegExp(`^${COMMANDS.MOVE_TO}(.+)$`), async (ctx) => {
    if (!ctx.callbackQuery.message) {
      return;
    }

    const targetLocationId = ctx.match[1];
    const { id: telegramId } = ctx.from;
    const { playerRepository, locationRepository } = ctx.gameContext;

    const player = await playerRepository.getPlayer(telegramId);
    if (!player) return;

    // Проверяем возможность перемещения
    const currentLocation = await locationRepository.getLocation(
      player.location
    );
    if (!currentLocation) return;

    // Валидация: можно ли перейти в целевую локацию
    if (!currentLocation.connectedLocations.includes(targetLocationId)) {
      await ctx.answerCbQuery("Вы не можете туда попасть!");
      return;
    }

    // Перемещение
    await playerRepository.updatePlayer(telegramId, {
      location: targetLocationId,
    });
    const newLocation = await locationRepository.getLocation(targetLocationId);
    const newConnectedLocations =
      await locationRepository.getConnectedLocations(targetLocationId);

    // Обновляем сообщение с новой информацией о локации
    await ctx.editMessageText(
      formatLocationDescription(newLocation!, newConnectedLocations),
      {
        reply_markup: createLocationKeyboard(
          newLocation!,
          newConnectedLocations
        ).reply_markup,
        parse_mode: "HTML",
      }
    );

    await ctx.answerCbQuery(`Вы перешли в ${newLocation!.name}`);
  });
}

function formatLocationDescription(
  location: Location,
  connectedLocations: Location[]
): string {
  return `
📍 Локация: ${location.name}

${location.description}

🚪 Доступные пути:
${connectedLocations
  .map((loc) => `${loc.isSafe ? "🏰" : "⚠️"} ${loc.name}`)
  .join("\n")}
`;
}
