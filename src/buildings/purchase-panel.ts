import { bindable, computedFrom } from "aurelia-framework";

import { Tile, TileBuildingsMap } from "../board/tile";

export class PurchasePanel {
  @bindable() public tile: Tile;

  @computedFrom("tile")
  public get building() {
    return TileBuildingsMap[this.tile.type];
  }
}
