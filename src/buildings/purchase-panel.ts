import { autoinject, bindable, computedFrom } from "aurelia-framework";
import { Store } from "aurelia-store";

import { Tile } from "../board/tile";

import { State, buyBuilding } from "../store/index";
import { TileBuildingsMap, TileBuilding } from "./tile-building";

@autoinject()
export class PurchasePanel {
  @bindable() public tile: Tile;
  @bindable() public tileBuilding?: TileBuilding;

  constructor(private store: Store<State>) {}

  @computedFrom("tile")
  public get building() {
    return TileBuildingsMap[this.tile.type];
  }

  public buyBuilding() {
    const newBuilding = new TileBuilding();
    newBuilding.tile = this.tile;
    this.store.dispatch(buyBuilding, newBuilding);
  }
}
