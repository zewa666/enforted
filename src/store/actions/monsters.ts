import { calculateDmg } from "../../buildings/tile-building";
import { Monster } from "../../monster/monster";
import { randBetween } from "../helper";
import { State } from "../state";

export function monsterRoll(state: State, diceOverload?: number): State {
  const monsters = state.monsters.map((m) => {
    const idxOfTile = state.tiles.findIndex((t) => t.id === m.currentTileId);
    const roll = diceOverload || randBetween(1, 6);
    const newPosition = idxOfTile + roll;
    const nextPosition = newPosition > state.tiles.length - 1
      ? state.tiles[state.tiles.length - 1].id
      : state.tiles[newPosition].id;
    const tileBuilding = state.tileBuildings.find((tb) => tb.tileId === nextPosition);
    const newHp = tileBuilding ? m.stats.hp - calculateDmg(tileBuilding.garrison) : m.stats.hp;

    if (
      newHp <= 0 ||
      (
        state.tiles[newPosition].type === "fire_fountain" &&
        state.fireFountainsActive === true
      )
    ) {
      return undefined;
    }

    return {
      ...m,
      currentTileId: nextPosition,
      stats: {
        ...m.stats,
        hp: newHp
      },
    } as Monster;
  }).filter((m) => m);

  return {
    ...state,
    monsters
  };
}
