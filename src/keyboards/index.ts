import { Markup } from "telegraf";
import { Location } from "@/types";
import { COMMANDS } from "../constants/commands";

// Общие клавиатуры
export const mainMenuKeyboard = Markup.keyboard([
  [COMMANDS.STATUS, COMMANDS.EXPLORE],
  [COMMANDS.SHOP, COMMANDS.RETURN_TO_TOWN],
]).resize();

export const locationKeyboard = Markup.keyboard([
  [COMMANDS.LOOK_AROUND, COMMANDS.ATTACK],
  [COMMANDS.RETURN_TO_TOWN],
]).resize();

export const battleKeyboard = Markup.keyboard([
  [COMMANDS.ATTACK, COMMANDS.ESCAPE],
]).resize();

export const shopKeyboard = Markup.keyboard([
  [COMMANDS.BUY_SWORD, COMMANDS.BUY_POTION],
  [COMMANDS.EXIT_SHOP],
]).resize();

// Функция создания клавиатуры для конкретной локации
export function createLocationKeyboard(
  currentLocation: Location,
  connectedLocations: Location[]
) {
  const buttons = connectedLocations.map((loc) => ({
    text: `${loc.isSafe ? "🏰" : "⚠️"} ${loc.name}`,
    callback_data: `${COMMANDS.MOVE_TO}${loc.id}`, // move_to:1-2
  }));

  return {
    reply_markup: {
      inline_keyboard: buttons.map((btn) => [
        { text: btn.text, callback_data: btn.callback_data },
      ]),
    },
  };
}
