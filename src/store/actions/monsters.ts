import { calculateDmg } from "../../buildings/tile-building";
import { Monster, MonsterPropMap, MonsterType } from "../../monster/monster";
import { randBetween } from "../helper";
import { State } from "../state";

export function monsterRoll(state: State, diceOverload?: number): State {
  let kills = 0;
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
    let newHp = tileBuilding ? m.stats.hp - calculateDmg(tileBuilding.garrison) : m.stats.hp;

    // if the monster is waiting at the gates of the fortress
    if (idxOfTile === state.tiles.length - 1) {
      const { defense, soldiers } = state.stats;
      const attackChance = Math.floor((100 - defense) / Math.ceil(roll / 2));
      const monsterAttackSuccess = randBetween(1, 100) <= attackChance;
      const effectiveMonsterDmg = m.stats.dmg - soldiers;

      if (!monsterAttackSuccess) {
        newHp -= effectiveMonsterDmg < 0
          ? Math.abs(effectiveMonsterDmg)
          : 2;
      } else if (monsterAttackSuccess && effectiveMonsterDmg > 0) {
        kills += 1;
      }
    }

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
    monsters,
    stats: {
      ...state.stats,
      population: state.stats.population - kills
    }
  };
}

export function generateWave(state: State, isNextRound: boolean): State {
  if (!isNextRound || !wavesAtRounds.hasOwnProperty(state.round + 1)) {
    return state;
  }

  const newMonsters = wavesAtRounds[state.round + 1].map((type) => ({
    currentTileId: state.tiles[0].id,
    stats: { ...MonsterPropMap[type].stats },
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
