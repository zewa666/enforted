import { Tile } from "../board/tile";
import { AvailableTragedyEvents } from "../board/tragedy";
import { AvailableFortressBuildings, FortressBuilding } from "../buildings/fortress-building";
import { TileBuilding } from "../buildings/tile-building";
import { Monster, MonsterPropMap } from "../monster/monster";
import { Player } from "../player/player";
import { Resources, Stats } from "../resources/index";
import { guid } from "./helper";

export const LOCALSTORAGE_SAVE_KEY = "enforted-save-game";
export interface State {
  tiles: Tile[];
  players: Player[];
  monsters: Monster[];
  fortressBuildings: FortressBuilding[];
  tileBuildings: TileBuilding[];
  lastDiceRoll?: number;
  resources: Resources;
  round: number;
  stats: Stats;
  activeFortressBuildingConstruction?: AvailableFortressBuildings;
  activeTragedy?: AvailableTragedyEvents;
  activeTragedyParams?: any[];
  /**
   * Setting this to undefined closes the purchase panel
   */
  purchaseInProgress?: string;
  fireFountainsActive: boolean;
}

export const initialState = {
  fireFountainsActive: false,
  fortressBuildings: [],
  lastDiceRoll: undefined,
  monsters: [],
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
  stats: {
    defense: 0,
    population: 10,
    soldiers: 0
  },
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
    {
      id: guid(),
      isCorner: true,
      placement: "top",
      ring: "outer",
      type: "tragedy"
    },
    ...Array.from<Tile, Partial<Tile>>(Array(9), (_, idx) => ({
      id: guid(),
      isCorner: false,
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
    {
      id: guid(),
      isCorner: true,
      placement: "bottom",
      ring: "inner",
      type: "fire_fountain",
    },
    ...Array.from<Tile, Partial<Tile>>(Array(6), (_, idx) => ({
      id: guid(),
      isCorner: false,
      placement: "bottom",
      ring: "inner",
      type: "iron",
    })),
    {
      id: guid(),
      isCorner: false,
      placement: "bottom",
      ring: "inner",
      type: "construction-site",
    },
    {
      id: guid(),
      isCorner: true,
      placement: "bottom",
      ring: "inner",
      type: "construction-site",
    },
    {
      id: guid(),
      isCorner: false,
      placement: "left",
      ring: "inner",
      type: "construction-site",
    },
    ...Array.from<Tile, Partial<Tile>>(Array(6), (_, idx) => ({
      id: guid(),
      isCorner: false,
      placement: "left",
      ring: "inner",
      type: idx === 3 ? "sacred_grounds" : "mana",
    })),
    {
      id: guid(),
      isCorner: true,
      placement: "top",
      ring: "inner",
      type: "fire_fountain",
    },
    ...Array.from<Tile, Partial<Tile>>(Array(7), (_, idx) => ({
      id: guid(),
      isCorner: false,
      placement: "top",
      ring: "inner",
      type: idx === 4 ? "sacred_grounds" : "coal",
    })),
    {
      id: guid(),
      isCorner: true,
      placement: "top",
      ring: "inner",
      type: "tragedy"
    },
    ...Array.from<Tile, Partial<Tile>>(Array(7), (_, idx) => ({
      id: guid(),
      isCorner: false,
      placement: "right",
      ring: "inner",
      type: idx === 6 ? "rally_point" : "blood",
    })),
  ]
} as State;

const player = {} as Player;
player.name = "zewa";
player.currentTileId = initialState.tiles[0].id;
initialState.players.push(player);

initialState.monsters.push({
  currentTileId: initialState.tiles[1].id,
  stats: { ...MonsterPropMap.Zombie.stats},
  type: "Zombie"
} as Monster, {
  currentTileId: initialState.tiles[2].id,
  stats: { ...MonsterPropMap.Dragon.stats},
  type: "Dragon"
} as Monster, {
  currentTileId: initialState.tiles[3].id,
  stats: { ...MonsterPropMap.Golem.stats},
  type: "Golem"
} as Monster, {
  currentTileId: initialState.tiles[5].id,
  stats: { ...MonsterPropMap.Skeleton.stats},
  type: "Skeleton"
} as Monster);
