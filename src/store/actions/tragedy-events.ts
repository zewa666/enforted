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
