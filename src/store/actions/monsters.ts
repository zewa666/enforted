import { Monster } from "../../monster/monster";
import { randBetween } from "../helper";
import { State } from "../state";

export function monsterRoll(state: State): State {
  const monsters = state.monsters.map((m) => {
    const idxOfTile = state.tiles.findIndex((t) => t.id === m.currentTileId);
    const roll = randBetween(1, 6);
    const newPosition = idxOfTile + roll;

    return {
      ...m,
      currentTileId: newPosition > state.tiles.length - 1
        ? state.tiles[state.tiles.length - 1].id
        : state.tiles[newPosition].id
    } as Monster;
  });

  return {
    ...state,
    monsters
  };
}
