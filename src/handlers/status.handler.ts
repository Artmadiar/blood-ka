import { Telegraf } from "telegraf";
import { BotContext } from "../types/context";
import { COMMANDS } from "../constants/commands";
import { mainMenuKeyboard } from "../keyboards";

export function registerStatusHandler(bot: Telegraf<BotContext>) {
  bot.hears(COMMANDS.STATUS, async (ctx) => {
    const { id: telegramId } = ctx.from;
    const { playerRepository } = ctx.gameContext;

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
}
