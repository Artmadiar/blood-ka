// 20241224_seed_initial_locations.ts
import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  const initialLocations = [
    {
      id: "0-0",
      name: "Городская площадь",
      description:
        "Оживлённый центр города. Здесь находится рынок и городская стража.",
      is_safe: true,
      // Используем строковый формат JSON для PostgreSQL
      connected_locations: JSON.stringify(["0-1", "1-0"]),
      properties: JSON.stringify({
        hasShop: true,
        hasHealer: true,
        isStartLocation: true,
      }),
    },
    {
      id: "0-1",
      name: "Северные ворота",
      description: "Северный выход из города. Отсюда начинается дорога в лес.",
      is_safe: true,
      connected_locations: JSON.stringify(["0-0", "0-2", "1-1"]),
      properties: JSON.stringify({}),
    },
    {
      id: "0-2",
      name: "Тёмный лес",
      description: "Густой лес с опасными тварями.",
      is_safe: false,
      connected_locations: JSON.stringify(["0-1", "1-2"]),
      properties: JSON.stringify({
        monsterLevel: 1,
        monsterChance: 0.3,
      }),
    },
  ];

  try {
    // Сначала очистим таблицу для безопасности
    await knex("locations").delete();

    // Вставляем по одной записи для лучшей диагностики
    for (const location of initialLocations) {
      await knex("locations").insert(location);
    }
  } catch (error) {
    console.error("Error inserting locations:", error);
    throw error;
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex("locations").delete();
}
