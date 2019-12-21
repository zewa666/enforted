import { autoinject, bindable, computedFrom } from "aurelia-framework";
import { Store } from "aurelia-store";

import { Tile } from "../board/tile";

import {
  buyBuilding,
  closePurchasePanel,
  Resources,
  ResourcesIcons,
  State
} from "../store/index";
import {
  TileBuilding,
  TileBuildingResourceCost,
  TileBuildingsIcon,
  TileBuildingsMap
} from "./tile-building";

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
    const entries = Object.entries<number>(TileBuildingResourceCost[this.building]).filter((r) => r[1] !== 0);

    return entries.map((e) => ({
      icon: ResourcesIcons[e[0]],
      resource: e[0],
      value: e[1],
    }));
  }

  @computedFrom("resources")
  public get sufficientResources() {
    return !this.costs.some((c) => this.resources[c.resource] - c.value < 0);
  }

  @computedFrom("tileBuilding")
  public get buildingIcon() {
    return TileBuildingsIcon[this.building];
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
