import { State } from "../index";
import { Tile } from "../../board/tile";
import { TileBuilding, TileBuildingResourceCost } from "../../buildings/tile-building";

export function rollDice(state: State): State {
  const idxOfTile = state.tiles.indexOf(state.players[0].currentTile);
  const roll = Math.floor(Math.random() * (6 - 1)) + 1;
  const newPosition = idxOfTile + roll;

  return {
    ...state,
    lastDiceRoll: roll,
    turn: newPosition > state.tiles.length - 1
      ? state.turn + 1
      : state.turn,
    players: [
      { ...state.players[0],
        currentTile: newPosition > state.tiles.length - 1
          ? state.tiles[Math.abs(newPosition - state.tiles.length)]
          : state.tiles[newPosition]
      }
    ]
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
    tileBuildings: [
      ...state.tileBuildings, building
    ],
    resources: {
      blood: state.resources.blood - costs.blood,
      stone: state.resources.stone - costs.stone,
      food: state.resources.food - costs.food,
      mana: state.resources.mana - costs.mana,
      iron: state.resources.iron - costs.iron,
      coal: state.resources.coal - costs.coal,
      wood: state.resources.wood - costs.wood,
      gold: state.resources.gold - costs.gold,
    },
    purchaseInProgress: undefined
  };
}
