import { Tile } from "../../board/tile";
import { AvailableTragedyEvents } from "../../board/tragedy";
import {
  AvailableFortressBuildings,
  FortressBuilding,
  FortressBuildingResourceCost
} from "../../buildings/fortress-building";
import { AvailableTileBuildings, TileBuilding, TileBuildingResourceCost } from "../../buildings/tile-building";
import { Player } from "../../player/player";
import { randBetween } from "../helper";
import { State } from "../index";
import { Resources } from "../state";

export function rollDice(state: State, diceOverload?: number): State {
  const isStumblingStep = state.activeTragedy === AvailableTragedyEvents.StumblingSteps;
  const idxOfTile = state.tiles.findIndex((t) => t.id === state.players[0].currentTileId);
  const roll = diceOverload || (isStumblingStep ? 1 : randBetween(1, 6));
  const newPosition = idxOfTile + roll;
  const isNextRound = newPosition > state.tiles.length - 1;
  const newStumblingSteps = (state.activeTragedyParams === undefined || state.activeTragedyParams[0] === 1)
    ? undefined
    : [state.activeTragedyParams[0] - 1];

  return {
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
  };
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

export function openPurchaseForTile(state: State, tile: Tile): State {
  return {
    ...state,
    purchaseInProgress: tile.id
  };
}

export function closePurchasePanel(state: State) {
  return {
    ...state,
    purchaseInProgress: undefined
  };
}

export function buyBuilding(state: State, building: TileBuilding): State {
  const costs = TileBuildingResourceCost[building.type];

  return {
    ...state,
    purchaseInProgress: undefined,
    resources: {
      blood: state.resources.blood - costs.blood,
      coal: state.resources.coal - costs.coal,
      food: state.resources.food - costs.food,
      gold: state.resources.gold - costs.gold,
      iron: state.resources.iron - costs.iron,
      mana: state.resources.mana - costs.mana,
      stone: state.resources.stone - costs.stone,
      wood: state.resources.wood - costs.wood,
    },
    tileBuildings: [
      ...state.tileBuildings, building
    ]
  };
}

export function buyFortressBuilding(state: State, type: AvailableFortressBuildings): State | false {
  const costs = FortressBuildingResourceCost[type];

  if (state.activeFortressBuildingConstruction) {
    return false;
  }

  return {
    ...state,
    activeFortressBuildingConstruction: type,
    fortressBuildings: [
      ...state.fortressBuildings, { type } as FortressBuilding
    ],
    resources: {
      blood: state.resources.blood - costs.blood,
      coal: state.resources.coal - costs.coal,
      food: state.resources.food - costs.food,
      gold: state.resources.gold - costs.gold,
      iron: state.resources.iron - costs.iron,
      mana: state.resources.mana - costs.mana,
      stone: state.resources.stone - costs.stone,
      wood: state.resources.wood - costs.wood,
    },
  };
}
