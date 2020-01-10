import { AvailableTileBuildings } from "buildings/tile-building";
import { AvailableTragedyEvents } from "../../board/tragedy";
import { Player } from "../../player/player";
import { ResourceTileType } from "../../resources/index";
import { randBetween } from "../helper";
import { State } from "../state";
import { destroyBuilding } from "./commands";

export function sacrificeResources(
  state: State,
  resourceType: ResourceTileType,
  byAmount: number
): State {
  return {
    ...state,
    activeTragedy: AvailableTragedyEvents.Sacrifice,
    resources: {
      ...state.resources,
      [resourceType]: Math.max(0, state.resources[resourceType] - byAmount)
    }
  };
}

export function ragingFire(
  state: State,
  tileId: string
): State {
  return destroyBuilding(state, tileId);
}

export function forgottenEquipment(state: State): State {
  return {
    ...state,
    activeTragedy: undefined,
    activeTragedyParams: undefined,
    fireFountainsActive: false,
    players: [
      {
        ...state.players[0],
        currentTileId: state.tiles.find((t) => t.type === "start").id
      } as Player
    ]
  };
}

export function defiledAltar(state: State): State {
  const shrines = state.tileBuildings.filter((tb) => tb.type === "shrine");
  const idx = randBetween(0, shrines.length - 1);

  return {
    ...state,
    activeTragedy: AvailableTragedyEvents.DefiledAltar,
    tileBuildings: [
      ...state.tileBuildings.filter((tb) => tb.tileId !== shrines[idx].tileId),
    ]
  };
}

export function pausedResourceProduction(
  state: State,
  tragedy: AvailableTragedyEvents
): State {
  return {
    ...state,
    activeTragedy: tragedy
  };
}

export function collapsedMines(state: State, mineType: AvailableTileBuildings): State {
  return {
    ...state,
    activeTragedy: AvailableTragedyEvents.CollapsedMines,
    activeTragedyParams: [mineType]
  };
}

export function stumblingSteps(state: State): State {
  return {
    ...state,
    activeTragedy: AvailableTragedyEvents.StumblingSteps,
    activeTragedyParams: [3]
  };
}
