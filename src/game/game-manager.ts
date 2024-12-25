import { Player, Monster, LocationType } from "@/types";
import { PlayerRepository } from "@/db/repositories/player.repository";

export class GameManager {
  constructor(private readonly playerRepository: PlayerRepository) {}

  async createPlayer(telegramId: number, name: string): Promise<Player> {
    const newPlayer: Omit<Player, "id" | "createdAt" | "updatedAt"> = {
      telegramId,
      name,
      level: 1,
      hp: 100,
      maxHp: 100,
      attack: 10,
      exp: 0,
      gold: 0,
      location: "town",
    };

    return this.playerRepository.createPlayer(newPlayer);
  }

  async getOrCreatePlayer(telegramId: number, name: string): Promise<Player> {
    const existingPlayer = await this.playerRepository.getPlayer(telegramId);
    if (existingPlayer) {
      return existingPlayer;
    }
    return this.createPlayer(telegramId, name);
  }

  async changeLocation(
    telegramId: number,
    location: LocationType
  ): Promise<void> {
    await this.playerRepository.updatePlayer(telegramId, { location });
  }
}
