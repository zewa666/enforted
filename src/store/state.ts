import { Tile, TileType } from "../board/tile";
import { TileBuilding } from "../buildings/tile-building";
import { Player } from "../player/player";
import { guid } from "./helper";

export const LOCALSTORAGE_SAVE_KEY = "enforted-save-game";

export type Resources = {
  [key in Exclude<TileType, "start" | "sacred_grounds">]: number;
};

export const ResourcesIcons: {
  [key in Exclude<TileType, "start" | "sacred_grounds">]: string
} = {
  blood: "bloody-stash",
  coal: "brick-pile",
  food: "wheat",
  gold: "two-coins",
  iron: "ore",
  mana: "vortex",
  stone: "stone-block",
  wood: "forest"
};

export interface State {
  tiles: Tile[];
  players: Player[];
  tileBuildings: TileBuilding[];
  lastDiceRoll?: number;
  resources: Resources;
  round: number;
  /**
   * Setting this to undefined closes the purchase panel
   */
  purchaseInProgress?: string;
}

export const initialState = {
  lastDiceRoll: undefined,
  players: [],
  resources: {
    blood: 0,
    coal: 0,
    food: 15,
    gold: 30,
    iron: 0,
    mana: 0,
    stone: 0,
    wood: 20,
  },
  round: 1,
  tileBuildings: [],
  tiles: [
    {
      id: guid(),
      isCorner: true,
      placement: "bottom",
      ring: "outer",
      type: "start"
    },
    ...Array.from<Tile, Partial<Tile>>(Array(9), (_, idx) => ({
      id: guid(),
      isCorner: false,
      placement: "bottom",
      ring: "outer",
      type: "wood",
    })),
    {
      id: guid(),
      isCorner: true,
      placement: "bottom",
      ring: "outer",
      type: "sacred_grounds"
    },
    ...Array.from<Tile, Partial<Tile>>(Array(9), () => ({
      id: guid(),
      isCorner: false,
      placement: "left",
      ring: "outer",
      type: "food",
    })),
    ...Array.from<Tile, Partial<Tile>>(Array(10), (_, idx) => ({
      id: guid(),
      isCorner: idx === 0,
      placement: "top",
      ring: "outer",
      type: "stone",
    })),
    {
      id: guid(),
      isCorner: true,
      placement: "top",
      ring: "outer",
      type: "sacred_grounds"
    },
    ...Array.from<Tile, Partial<Tile>>(Array(9), () => ({
      id: guid(),
      isCorner: false,
      placement: "right",
      ring: "outer",
      type: "gold",
    })),
    ...Array.from<Tile, Partial<Tile>>(Array(9), (_, idx) => ({
      id: guid(),
      isCorner: idx === 0 || idx === 8,
      placement: "bottom",
      ring: "inner",
      type: "iron",
    })),
    ...Array.from<Tile, Partial<Tile>>(Array(7), (_, idx) => ({
      id: guid(),
      isCorner: false,
      placement: "left",
      ring: "inner",
      type: idx === 4 ? "sacred_grounds" : "mana",
    })),
    ...Array.from<Tile, Partial<Tile>>(Array(9), (_, idx) => ({
      id: guid(),
      isCorner: idx === 0 || idx === 8,
      placement: "top",
      ring: "inner",
      type: "coal",
    })),
    ...Array.from<Tile, Partial<Tile>>(Array(7), (_, idx) => ({
      id: guid(),
      isCorner: false,
      placement: "right",
      ring: "inner",
      type: idx === 6 ? "sacred_grounds" : "blood",
    })),
  ]
} as State;

const player = {} as Player;
player.name = "zewa";
player.currentTileId = initialState.tiles[0].id;
initialState.players.push(player);
