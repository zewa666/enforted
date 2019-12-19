import { computedFrom } from "aurelia-framework";
import { connectTo } from "aurelia-store";
import { State } from "../store/state";

@connectTo()
export class CommandBar {
  public state: State;

  @computedFrom("state")
  public get purchaseTargetTile() {
    if (this.state.purchaseInProgress) {
      return this.state.tiles.find(t => t.id === this.state.purchaseInProgress);
    }
  }
}
