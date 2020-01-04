import { computedFrom } from "aurelia-framework";
import { connectTo } from "aurelia-store";

import { FortressBuilding } from "../buildings/fortress-building";
import { State } from "../store/state";

@connectTo()
export class BuildOverview {
  public state: State;

  @computedFrom("state.activeFortressBuildingConstruction")
  public get building(): FortressBuilding {
    const currBuilding = this.state && this.state
      .fortressBuildings
      .find((fb) => fb.type === this.state.activeFortressBuildingConstruction);

    if (currBuilding) {
      return Object.assign(new FortressBuilding(), currBuilding);
    }
  }
}
