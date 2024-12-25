import { Telegraf } from "telegraf";
import { BotContext } from "../types/context";
import { mainMenuKeyboard } from "../keyboards";

export function registerStartHandler(bot: Telegraf<BotContext>) {
  bot.command("start", async (ctx) => {
    const { id: telegramId } = ctx.from;
    const name = ctx.from.first_name;
    const { gameManager } = ctx.gameContext;

    const player = await gameManager.getOrCreatePlayer(telegramId, name);

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
}
