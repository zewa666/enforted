import { Tile } from "../../board/tile";
import { TileBuilding, TileBuildingResourceCost } from "../../buildings/tile-building";
import { State } from "../index";
import { Resources } from "../state";

export function rollDice(state: State): State {
  const idxOfTile = state.tiles.indexOf(state.players[0].currentTile);
  const roll = Math.floor(Math.random() * 6) + 1;
  const newPosition = idxOfTile + roll;
  const isNextRound = newPosition > state.tiles.length - 1;

  return {
    ...state,
    lastDiceRoll: roll,
    players: [
      {
        ...state.players[0],
        currentTile: newPosition > state.tiles.length - 1
        ? state.tiles[Math.abs(newPosition - state.tiles.length)]
        : state.tiles[newPosition]
      }
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

export function gatherResources(state: State): State {
  const resources = state.tileBuildings.reduce((prev, curr) => {
    prev[curr.tile.type] += 3;
    return prev;
  }, Object.assign({}, state.resources) as Resources);

  return {
    ...state,
    resources
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
