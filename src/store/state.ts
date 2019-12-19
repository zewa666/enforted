import { Tile, TileType } from "../board/tile";
import { Player } from "../player/player";
import { guid } from "./helper";
import { TileBuilding } from "buildings/tile-building";

export type Resources = {
  [key in TileType]: number;
}

export interface State {
  tiles: Tile[];
  players: Player[];
  tileBuildings: TileBuilding[],
  lastDiceRoll?: number;
  resources: Resources;
  turn: number;
  purchaseInProgress?: string;
}

export const initialState = {
  tiles: [
    ...Array.from<Tile, Partial<Tile>>(Array(11), (_, idx) => ({
      type: "wood",
      placement: "bottom",
      isCorner: idx === 0 || idx === 10,
      ring: "outer",
      id: guid()
    })),
    ...Array.from<Tile, Partial<Tile>>(Array(9), () => ({
      type: "food",
      placement: "left",
      isCorner: false,
      ring: "outer",
      id: guid()
    })),
    ...Array.from<Tile, Partial<Tile>>(Array(11), (_, idx) => ({
      type: "stone",
      placement: "top",
      isCorner: idx === 0 || idx === 10,
      ring: "outer",
      id: guid()
    })),
    ...Array.from<Tile, Partial<Tile>>(Array(9), () => ({
      type: "gold",
      placement: "right",
      isCorner: false,
      ring: "outer",
      id: guid()
    })),
    ...Array.from<Tile, Partial<Tile>>(Array(11), (_, idx) => ({
      type: "iron",
      placement: "bottom",
      isCorner: idx === 0 || idx === 10,
      ring: "inner",
      id: guid()
    })),
    ...Array.from<Tile, Partial<Tile>>(Array(9), () => ({
      type: "mana",
      placement: "left",
      isCorner: false,
      ring: "inner",
      id: guid()
    })),
    ...Array.from<Tile, Partial<Tile>>(Array(11), (_, idx) => ({
      type: "coal",
      placement: "top",
      isCorner: idx === 0 || idx === 10,
      ring: "inner",
      id: guid()
    })),
    ...Array.from<Tile, Partial<Tile>>(Array(9), () => ({
      type: "blood",
      placement: "right",
      isCorner: false,
      ring: "inner",
      id: guid()
    })),
  ],
  players: [],
  lastDiceRoll: undefined,
  resources: {
    blood: 0,
    coal: 0,
    iron: 0,
    mana: 0,
    stone: 0,
    food: 15,
    wood: 20,
    gold: 30,
  },
  turn: 1,
  purchaseInProgress: undefined,
  tileBuildings: []
} as State;

const player = new Player();
player.name = "zewa";
player.currentTile = initialState.tiles[0];
initialState.players.push(player);
