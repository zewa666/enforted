import { calculateDmg } from "../../buildings/tile-building";
import { Monster, MonsterPropMap, MonsterType } from "../../monster/monster";
import { randBetween } from "../helper";
import { State } from "../state";

export function monsterRoll(state: State, diceOverload?: number): State {
  const monsters = state.monsters.map((m) => {
    const idxOfTile = state.tiles.findIndex((t) => t.id === m.currentTileId);
    const roll = diceOverload || randBetween(1, 6);
    const newPosition = (idxOfTile + roll) > state.tiles.length - 1
      ? state.tiles.length - 1
      : idxOfTile + roll;
    const nextId = newPosition > state.tiles.length - 1
      ? state.tiles[state.tiles.length - 1].id
      : state.tiles[newPosition].id;
    const tileBuilding = state.tileBuildings.find((tb) => tb.tileId === nextId);
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
      currentTileId: nextId,
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

export function generateWave(state: State, isNextRound: boolean): State {
  if (!isNextRound || !wavesAtRounds.hasOwnProperty(state.round + 1)) {
    return state;
  }

  const newMonsters = wavesAtRounds[state.round + 1].map((type) => ({
      currentTileId: state.tiles[0].id,
      stats: { ...MonsterPropMap[type].stats},
      type
    } as Monster));

  return {
    ...state,
     monsters: [...state.monsters, ...newMonsters]
  };
}

export const wavesAtRounds: {
  [round: number]: MonsterType[]
} = {
  15: [...new Array(2).fill("Zombie")],
  25: [...new Array(2).fill("Zombie"), "Skeleton"],
  32: [...new Array(3).fill("Skeleton")],
};
