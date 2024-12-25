// src/db/repositories/monster.repository.ts
import { Knex } from "knex";
import { Monster } from "@/types";

export class MonsterRepository {
  constructor(private readonly knex: Knex) {}

  async getMonstersByLevel(minLevel: number): Promise<Monster[]> {
    const monsters = await this.knex("monster_types")
      .where("min_level", "<=", minLevel)
      .whereRaw("properties->>'isBoss' IS NULL"); // Исключаем боссов из обычного пула

    return monsters;
  }

  async getBossForLevel(level: number): Promise<Monster | null> {
    const boss = await this.knex("monster_types")
      .whereRaw("properties->>'isBoss' = 'true'")
      .where("min_level", "<=", level)
      .first();

    return boss || null;
  }
}
