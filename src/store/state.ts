import { Tile } from "../board/tile";
import { Player } from "../player/player";

export interface State {
  tiles: Tile[];
  players: Player[];
}

export const initialState = {
  tiles: [
    ...Array.from<Tile, Tile>(Array(11), (_, idx) => ({
      type: "wood",
      placement: "bottom",
      isCorner: idx === 0 || idx === 10,
      ring: "outer"
    })),
    ...Array.from<Tile, Tile>(Array(9), () => ({
      type: "food",
      placement: "left",
      isCorner: false,
      ring: "outer"
    })),
    ...Array.from<Tile, Tile>(Array(11), (_, idx) => ({
      type: "stone",
      placement: "top",
      isCorner: idx === 0 || idx === 10,
      ring: "outer"
    })),
    ...Array.from<Tile, Tile>(Array(9), () => ({
      type: "gold",
      placement: "right",
      isCorner: false,
      ring: "outer"
    })),
    ...Array.from<Tile, Tile>(Array(11), (_, idx) => ({
      type: "iron",
      placement: "bottom",
      isCorner: idx === 0 || idx === 10,
      ring: "inner"
    })),
    ...Array.from<Tile, Tile>(Array(9), () => ({
      type: "mana",
      placement: "left",
      isCorner: false,
      ring: "inner"
    })),
    ...Array.from<Tile, Tile>(Array(11), (_, idx) => ({
      type: "coal",
      placement: "top",
      isCorner: idx === 0 || idx === 10,
      ring: "inner"
    })),
    ...Array.from<Tile, Tile>(Array(9), () => ({
      type: "blood",
      placement: "right",
      isCorner: false,
      ring: "inner"
    })),
  ],
  players: []
} as State;

const player = new Player();
player.name = "zewa";
player.currentTile = initialState.tiles[0];
initialState.players.push(player);
