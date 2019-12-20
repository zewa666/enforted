import { computedFrom } from "aurelia-framework";
import { connectTo } from "aurelia-store";
import { State } from "../store/state";

@connectTo()
export class CommandBar {
  public state: State;

  @computedFrom("state.tiles")
  public get purchaseTargetTile() {
    if (this.state.purchaseInProgress) {
      return this.state.tiles.find((t) => t.id === this.state.purchaseInProgress);
    }
  }

  @computedFrom("state.tileBuildings")
  public get existingTileBuilding() {
    return this.state.tileBuildings.find((b) => b.tile.id === (this.purchaseTargetTile && this.purchaseTargetTile.id));
  }
}
