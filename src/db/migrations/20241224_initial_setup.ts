import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  // Players table
  await knex.schema.createTable("players", (table) => {
    table.bigInteger("telegram_id").primary();
    table.string("name").notNullable();
    table.integer("level").defaultTo(1);
    table.integer("hp").defaultTo(100);
    table.integer("max_hp").defaultTo(100);
    table.integer("attack").defaultTo(10);
    table.integer("exp").defaultTo(0);
    table.integer("gold").defaultTo(0);
    // Локация теперь просто строка, можно хранить координаты или любой другой идентификатор
    table.string("location").defaultTo("0-0");
    table.timestamps(true, true);
  });

  // Добавим таблицу для самих локаций
  await knex.schema.createTable("locations", (table) => {
    table.string("id").primary();
    table.string("name").notNullable();
    table.text("description");
    table.boolean("is_safe").defaultTo(false);
    // Важно: используем специфичный тип для PostgreSQL
    table.jsonb("connected_locations").notNullable().defaultTo("[]");
    table.jsonb("properties").notNullable().defaultTo("{}");
    table.timestamps(true, true);
  });

  // Inventory table
  await knex.schema.createTable("inventory", (table) => {
    table
      .bigInteger("player_id")
      .references("telegram_id")
      .inTable("players")
      .onDelete("CASCADE");
    table.string("item_id").notNullable();
    table.integer("quantity").notNullable().defaultTo(1);
    table.timestamps(true, true);
    table.primary(["player_id", "item_id"]);
  });

  // Battles table (для хранения текущих боев)
  await knex.schema.createTable("active_battles", (table) => {
    table
      .bigInteger("player_id")
      .references("telegram_id")
      .inTable("players")
      .onDelete("CASCADE")
      .primary();
    table.string("monster_id").notNullable();
    table.integer("monster_hp").notNullable();
    table.timestamp("started_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("active_battles");
  await knex.schema.dropTableIfExists("inventory");
  await knex.schema.dropTableIfExists("players");
}
