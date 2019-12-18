import { Tile } from "../board/tile";
import { Player } from "../player/player";
import { guid } from "./helper";

export interface State {
  tiles: Tile[];
  players: Player[];
  lastDiceRoll?: number;
}

export const initialState = {
  tiles: [
    ...Array.from<Tile, Tile>(Array(11), (_, idx) => ({
      type: "wood",
      placement: "bottom",
      isCorner: idx === 0 || idx === 10,
      ring: "outer",
      id: guid(),
      isPlayerOnTile: false
    })),
    ...Array.from<Tile, Tile>(Array(9), () => ({
      type: "food",
      placement: "left",
      isCorner: false,
      ring: "outer",
      id: guid(),
      isPlayerOnTile: false
    })),
    ...Array.from<Tile, Tile>(Array(11), (_, idx) => ({
      type: "stone",
      placement: "top",
      isCorner: idx === 0 || idx === 10,
      ring: "outer",
      id: guid(),
      isPlayerOnTile: false
    })),
    ...Array.from<Tile, Tile>(Array(9), () => ({
      type: "gold",
      placement: "right",
      isCorner: false,
      ring: "outer",
      id: guid(),
      isPlayerOnTile: false
    })),
    ...Array.from<Tile, Tile>(Array(11), (_, idx) => ({
      type: "iron",
      placement: "bottom",
      isCorner: idx === 0 || idx === 10,
      ring: "inner",
      id: guid(),
      isPlayerOnTile: false
    })),
    ...Array.from<Tile, Tile>(Array(9), () => ({
      type: "mana",
      placement: "left",
      isCorner: false,
      ring: "inner",
      id: guid(),
      isPlayerOnTile: false
    })),
    ...Array.from<Tile, Tile>(Array(11), (_, idx) => ({
      type: "coal",
      placement: "top",
      isCorner: idx === 0 || idx === 10,
      ring: "inner",
      id: guid(),
      isPlayerOnTile: false
    })),
    ...Array.from<Tile, Tile>(Array(9), () => ({
      type: "blood",
      placement: "right",
      isCorner: false,
      ring: "inner",
      id: guid(),
      isPlayerOnTile: false
    })),
  ],
  players: [],
  lastDiceRoll: undefined
} as State;

const player = new Player();
player.name = "zewa";
player.currentTile = initialState.tiles[0];
initialState.players.push(player);
