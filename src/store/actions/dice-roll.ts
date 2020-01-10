import { AvailableTragedyEvents } from "../../board/tragedy";
import { AvailableTileBuildings } from "../../buildings/tile-building";
import { Player } from "../../player/player";
import { Resources, Stats } from "../../resources/index";
import { randBetween } from "../helper";
import { State } from "../index";

export function rollDice(state: State, diceOverload?: number): State {
  const isStumblingStep = state.activeTragedy === AvailableTragedyEvents.StumblingSteps;
  const idxOfTile = state.tiles.findIndex((t) => t.id === state.players[0].currentTileId);
  const roll = diceOverload || (isStumblingStep ? 1 : randBetween(1, 6));
  const newPosition = idxOfTile + roll;
  const isNextRound = newPosition > state.tiles.length - 1;
  const newStumblingSteps = (state.activeTragedyParams === undefined || state.activeTragedyParams[0] === 1)
    ? undefined
    : [state.activeTragedyParams[0] - 1];

  return gatherFortressBuilding({
    ...state,
    activeFortressBuildingConstruction: isNextRound ? undefined : state.activeFortressBuildingConstruction,
    activeTragedy: isNextRound
      ? undefined
      : isStumblingStep && newStumblingSteps === undefined
        ? undefined
        : state.activeTragedy,
    activeTragedyParams: isNextRound
      ? undefined
      : isStumblingStep
        ? newStumblingSteps
        : state.activeTragedyParams,
    lastDiceRoll: roll,
    players: [
      {
        ...state.players[0],
        currentTileId: newPosition > state.tiles.length - 1
          ? state.tiles[Math.abs(newPosition - state.tiles.length)].id
          : state.tiles[newPosition].id
      } as Player
    ],
    purchaseInProgress: undefined,
    resources: isNextRound
      ? gatherResources(state).resources
      : state.resources,
    round: isNextRound
      ? state.round + 1
      : state.round,
  }, isNextRound);
}

export function gatherFortressBuilding(state: State, isNextRound: boolean): State {
  if (!isNextRound) {
    return state;
  }

  const newState = {
    ...state,
    resources: { ...state.resources },
    stats: { ...state.stats }
  } as State;

  return newState.fortressBuildings.reduce((prev, curr) => {
    switch (curr.type) {
      case "bakery":
        const res = prev.resources.coal > 0 && "coal" || prev.resources.wood > 0 && "wood";

        if (res) {
          prev.resources[res] -= 1;
          prev.stats.population += 1;
        }
      case "blacksmith_shop":
        if (prev.resources.iron > 0 && prev.resources.coal > 0) {
          prev.resources.iron -= 1;
          prev.resources.coal -= 1;
          prev.stats.soldiers += 1;
        }
    }

    return prev;
  }, newState);
}

export const PRODUCED_RESOURCES_PER_ROUND = 3;
export function gatherResources(state: State): State {
  const shrines = state.tileBuildings
    .filter((b) => b.type === "shrine");
  const resourcesProduced = PRODUCED_RESOURCES_PER_ROUND
    + (shrines.length === 4
      ? 1
      : 0);
  const resources = state.tileBuildings
    .filter((b) => b.type !== "shrine")
    .filter((b) => {
      switch (state.activeTragedy) {
        case AvailableTragedyEvents.BurningTrees:
          return b.type !== "sawmill";
        case AvailableTragedyEvents.ContaminatedBlood:
          return b.type !== "butchery";
        case AvailableTragedyEvents.Rockfall:
          return b.type !== "quarry";
        case AvailableTragedyEvents.ShatteringEarth:
          return b.type !== "mana_rift";
        case AvailableTragedyEvents.Vermins:
          return b.type !== "farm";
        case AvailableTragedyEvents.CollapsedMines:
          const mineType = state.activeTragedyParams[0] as AvailableTileBuildings;
          return b.type !== mineType;
        default:
          return true;
      }
    })
    .reduce((prev, curr) => {
      prev[state.tiles
        .find((t) => t.id === curr.tileId)
        .type] += resourcesProduced;
      return prev;
    }, Object.assign({}, state.resources) as Resources);
  return gatherShrineResources({
    ...state,
    resources
  });
}

export function gatherShrineResources(state: State) {
  const shrines = state.tileBuildings
    .filter((b) => b.type === "shrine");
  if (!shrines) {
    return state;
  }
  return {
    ...state,
    resources: {
      ...state.resources,
      blood: shrines.length > 2 ? state.resources.blood + 1 : state.resources.blood,
      gold: shrines.length > 0 ? state.resources.gold + 1 : state.resources.gold,
      mana: shrines.length > 1 ? state.resources.mana + 1 : state.resources.mana,
    }
  };
}
