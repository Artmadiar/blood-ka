// src/db/repositories/monster.repository.ts
import { Knex } from "knex";
import { Monster } from "@/types";

export class MonsterRepository {
  constructor(private readonly knex: Knex) {}

  async getMonstersByLevel(minLevel: number): Promise<Monster[]> {
    const monsters = await this.knex("monster_types")
      .where("min_level", "<=", minLevel)
      .whereRaw("properties->>'isBoss' IS NULL"); // Исключаем боссов из обычного пула

    return monsters.map(this.mapToMonster);
  }

  async getBossForLevel(level: number): Promise<Monster | null> {
    const boss = await this.knex("monster_types")
      .whereRaw("properties->>'isBoss' = 'true'")
      .where("min_level", "<=", level)
      .first();

    return boss ? this.mapToMonster(boss) : null;
  }

  private mapToMonster(data: any): Monster {
    return {
      id: data.id,
      name: data.name,
      description: data.description,
      hp: data.base_hp,
      maxHp: data.base_hp,
      attack: data.base_attack,
      expReward: data.exp_reward,
      goldReward: data.gold_reward,
      properties: data.properties,
    };
  }
}
