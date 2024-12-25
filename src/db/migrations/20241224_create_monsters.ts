// src/db/migrations/20241224_create_monsters.ts
import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("monster_types", (table) => {
    table.string("id").primary();
    table.string("name").notNullable();
    table.text("description");
    table.integer("base_hp").notNullable();
    table.integer("base_attack").notNullable();
    table.integer("exp_reward").notNullable();
    table.integer("gold_reward").notNullable();
    table.integer("min_level").defaultTo(1);
    table.jsonb("properties"); // Дополнительные свойства монстра
    table.timestamps(true, true);
  });

  // Добавляем базовых монстров
  const monsters = [
    {
      id: "wolf",
      name: "Волк",
      description: "Дикий голодный волк",
      base_hp: 50,
      base_attack: 8,
      exp_reward: 20,
      gold_reward: 10,
      min_level: 1,
      properties: {
        type: "beast",
      },
    },
    {
      id: "goblin",
      name: "Гоблин",
      description: "Мелкий гоблин-разбойник",
      base_hp: 40,
      base_attack: 12,
      exp_reward: 25,
      gold_reward: 15,
      min_level: 1,
      properties: {
        type: "humanoid",
      },
    },
    {
      id: "skeleton",
      name: "Скелет",
      description: "Древний скелет-воин",
      base_hp: 60,
      base_attack: 15,
      exp_reward: 35,
      gold_reward: 20,
      min_level: 2,
      properties: {
        type: "undead",
      },
    },
    {
      id: "dragon",
      name: "Молодой дракон",
      description: "Опасный молодой дракон",
      base_hp: 200,
      base_attack: 30,
      exp_reward: 100,
      gold_reward: 100,
      min_level: 4,
      properties: {
        type: "dragon",
        isBoss: true,
      },
    },
  ];

  await knex("monster_types").insert(monsters);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("monster_types");
}
