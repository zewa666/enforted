import { Tile } from "../../board/tile";
import { TileBuilding, TileBuildingResourceCost } from "../../buildings/tile-building";
import { State } from "../index";
import { Resources } from "../state";

export function rollDice(state: State): State {
  const idxOfTile = state.tiles.findIndex((t) => t.id === state.players[0].currentTileId);
  const roll = Math.floor(Math.random() * 6) + 1;
  const newPosition = idxOfTile + roll;
  const isNextRound = newPosition > state.tiles.length - 1;

  return {
    ...state,
    lastDiceRoll: roll,
    players: [
      {
        ...state.players[0],
        currentTileId: newPosition > state.tiles.length - 1
          ? state.tiles[Math.abs(newPosition - state.tiles.length)].id
          : state.tiles[newPosition].id
      } as any
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
