import { ArgumentOutOfRangeError } from "rxjs";

import { Tile, TileType } from "../../src/board/tile";
import { State } from "../../src/store/index";

export function getTileByType(state: State, type: TileType): Tile {
  return state.tiles.find((t) => t.type === type);
}

export function getPreviousTileOf(state: State, tileId: string): Tile {
  const idx = state.tiles.findIndex((t) => t.id === tileId);

  if (idx === 0) {
    throw new ArgumentOutOfRangeError();
  }

  return state.tiles[idx - 1];
}
