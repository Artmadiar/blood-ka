import { Knex } from "knex";
import { Player } from "@/types";

export class PlayerRepository {
  constructor(private readonly knex: Knex) {}

  async createPlayer(
    player: Omit<Player, "id" | "createdAt" | "updatedAt">
  ): Promise<Player> {
    const [newPlayer] = await this.knex("players")
      .insert({
        ...player,
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning("*");

    return this.mapToPlayer(newPlayer);
  }

  async getPlayer(telegramId: number): Promise<Player | null> {
    const player = await this.knex("players")
      .where({ telegram_id: telegramId })
      .first();

    return player ? this.mapToPlayer(player) : null;
  }

  async updatePlayer(
    telegramId: number,
    updates: Partial<Player>
  ): Promise<void> {
    await this.knex("players")
      .where({ telegram_id: telegramId })
      .update({
        ...updates,
        updated_at: new Date(),
      });
  }

  private mapToPlayer(data: any): Player {
    return {
      telegramId: data.telegram_id,
      name: data.name,
      level: data.level,
      hp: data.hp,
      maxHp: data.max_hp,
      attack: data.attack,
      exp: data.exp,
      gold: data.gold,
      location: data.location,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }
}
