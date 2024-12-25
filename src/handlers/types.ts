import { GameManager } from "../game/game-manager";
import { LocationRepository } from "../db/repositories/location.repository";
import { PlayerRepository } from "../db/repositories/player.repository";
import { MonsterGenerator } from "../game/monster-generator";
import { Knex } from "knex";

export interface HandlerContext {
  playerRepository: PlayerRepository;
  locationRepository: LocationRepository;
  gameManager: GameManager;
  monsterGenerator: MonsterGenerator;
  db: Knex;
}
