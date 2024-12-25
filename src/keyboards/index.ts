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
  const navigationButtons = connectedLocations.map((loc) => {
    // Добавляем эмодзи в зависимости от типа локации
    const emoji = loc.isSafe ? "🏰" : "⚠️";
    return [`${emoji} ${loc.name}`];
  });

  const actionButtons = [];

  // Добавляем кнопки действий в зависимости от свойств локации
  if (currentLocation.properties?.hasShop) {
    actionButtons.push("🏪 Магазин");
  }

  if (currentLocation.properties?.hasHealer) {
    actionButtons.push("❤️ Лекарь");
  }

  if (!currentLocation.isSafe) {
    actionButtons.push("👀 Осмотреться");
  }

  return Markup.keyboard([
    ...navigationButtons,
    actionButtons,
    ["📍 Где я?"],
  ]).resize();
}
