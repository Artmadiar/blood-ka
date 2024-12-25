// src/game/monster-generator.ts
import { Monster, Location } from "@/types";
import { MonsterRepository } from "@/db/repositories/monster.repository";

export class MonsterGenerator {
  constructor(private readonly monsterRepository: MonsterRepository) {}

  async generateForLocation(
    location: Location,
    playerLevel: number
  ): Promise<Monster | null> {
    // Проверяем, есть ли шанс на появление монстра
    const spawnChance = location.properties?.monsterChance || 0;
    if (Math.random() > spawnChance) {
      return null;
    }

    // Если это локация с боссом
    if (location.properties?.hasBoss) {
      return this.monsterRepository.getBossForLevel(playerLevel);
    }

    // Получаем подходящих монстров для уровня игрока
    const possibleMonsters =
      await this.monsterRepository.getMonstersByLevel(playerLevel);
    if (possibleMonsters.length === 0) {
      return null;
    }

    // Случайно выбираем монстра
    const monster =
      possibleMonsters[Math.floor(Math.random() * possibleMonsters.length)];

    // Немного рандомизируем характеристики
    const variation = 0.2; // 20% вариации
    const multiplier = 1 + (Math.random() * variation * 2 - variation);

    return {
      ...monster,
      hp: Math.round(monster.hp * multiplier),
      maxHp: Math.round(monster.hp * multiplier),
      attack: Math.round(monster.attack * multiplier),
      goldReward: Math.round(monster.goldReward * multiplier),
    };
  }
}
