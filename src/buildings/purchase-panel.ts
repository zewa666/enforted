import { autoinject, bindable, computedFrom } from "aurelia-framework";
import { Store } from "aurelia-store";

import { Tile } from "../board/tile";

import { buyBuilding, closePurchasePanel, Resources, State } from "../store/index";
import { TileBuilding, TileBuildingResourceCost, TileBuildingsMap } from "./tile-building";

@autoinject()
export class PurchasePanel {
  @bindable() public tile: Tile;
  @bindable() public tileBuilding?: TileBuilding;
  @bindable() public resources: Resources;

  constructor(private store: Store<State>) { }

  @computedFrom("tile")
  public get building() {
    return TileBuildingsMap[this.tile.type];
  }

  @computedFrom("tile")
  public get costs() {
    return Object.entries<number>(TileBuildingResourceCost[this.building]).filter((r) => r[1] !== 0);
  }

  @computedFrom("resources")
  public get sufficientResources() {
    return !this.costs.some(([res, val]) => this.resources[res] - val < 0);
  }

  public buyBuilding() {
    const newBuilding = new TileBuilding();
    newBuilding.tile = this.tile;
    this.store.dispatch(buyBuilding, newBuilding);
  }

  public closePanel() {
    this.store.dispatch(closePurchasePanel);
  }
}
