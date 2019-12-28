import { AvailableTragedyEvents } from "../../board/tragedy";
import { ResourceTileType, State } from "../state";

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
