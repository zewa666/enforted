import { Tile } from "../../board/tile";
import { AvailableTragedyEvents } from "../../board/tragedy";
import {
  AvailableFortressBuildings,
  FortressBuilding,
  FortressBuildingResourceCost
} from "../../buildings/fortress-building";
import { TileBuilding, TileBuildingResourceCost } from "../../buildings/tile-building";
import { State } from "../index";

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

export function destroyBuilding(
  state: State,
  tileId: string
): State {
  const idx = state.tileBuildings.findIndex((tb) => tb.tileId === tileId);

  return {
    ...state,
    activeTragedy: AvailableTragedyEvents.RagingFire,
    tileBuildings: [
      ...state.tileBuildings.slice(0, idx),
      ...state.tileBuildings.slice(idx + 1),
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
