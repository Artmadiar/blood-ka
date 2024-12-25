export interface Location {
  id: string; // координаты типа "10-15"
  name: string;
  description: string;
  isSafe: boolean;
  connectedLocations: string[]; // массив id доступных соседних локаций
  properties?: {
    hasShop?: boolean;
    hasHealer?: boolean;
    monsterLevel?: number;
    // другие свойства локации
    [key: string]: any;
  };
}

export interface Player {
  telegramId: number;
  name: string;
  level: number;
  hp: number;
  maxHp: number;
  attack: number;
  exp: number;
  gold: number;
  location: string; // теперь это id локации
  createdAt: Date;
  updatedAt: Date;
}

export type LocationType = "town" | "forest" | "cave" | "shop";

export interface Monster {
  id: string;
  name: string;
  description: string;
  hp: number;
  maxHp: number;
  attack: number;
  expReward: number;
  goldReward: number;
  properties: Record<string, any>;
}

export interface Item {
  id: string;
  name: string;
  type: "weapon" | "potion";
  effect: number;
  price: number;
}
