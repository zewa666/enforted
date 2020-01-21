import { DialogController } from "aurelia-dialog";
import { autoinject, bindable, computedFrom } from "aurelia-framework";
import { Store } from "aurelia-store";
import { capitalize, upperFirst } from "lodash";

import { Tile } from "../board/tile";
import { Resources, ResourcesIcons, Stats } from "../resources/index";
import {
  buyBuilding,
  closePurchasePanel,
  destroyBuilding,
  reinforceTileBuilding,
  State
} from "../store/index";
import { DialogModel } from "../utils/utils";
import {
  MAX_SOLDIERS,
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
  @bindable() public stats: Stats;
  public dialogView?: string;
  public bemclasses?: string;

  constructor(
    private store: Store<State>,
    public controller: DialogController
  ) { }

  public activate(model: PurchasePanel & DialogModel) {
    this.tile = model.tile;
    this.tileBuilding = model.tileBuilding;
    this.resources = model.resources;
    this.stats = model.stats;
    this.dialogView = model.view;
    this.bemclasses = model.bem;
  }

  @computedFrom("tile")
  public get building() {
    return TileBuildingsMap[this.tile.type];
  }

  @computedFrom("tile")
  public get buildingName() {
    return capitalize(TileBuildingsMap[this.tile.type].replace(/_/g, " "));
  }

  @computedFrom("stats.soldiers", "tileBuilding.garrison")
  public get soldiersLeft() {
    return this.stats.soldiers > 0 && this.tileBuilding.garrison < MAX_SOLDIERS;
  }

  @computedFrom("tile")
  public get costs() {
    const entries = Object.entries<number>(TileBuildingResourceCost[this.building]).filter((r) => r[1] !== 0);

    return entries.map((e) => ({
      icon: ResourcesIcons[e[0]],
      resource: upperFirst(e[0]),
      value: e[1],
    }));
  }

  @computedFrom("resources")
  public get sufficientResources() {
    return !this.costs.some((c) => this.resources[c.resource.toLowerCase()] - c.value < 0);
  }

  @computedFrom("tileBuilding")
  public get buildingIcon() {
    return TileBuildingsIcon[this.building];
  }

  public buyBuilding() {
    const newBuilding = {} as TileBuilding;
    newBuilding.tileId = this.tile.id;
    newBuilding.type = TileBuildingsMap[this.tile.type];
    newBuilding.placement = this.tile.placement;
    newBuilding.garrison = 0;

    this.store.pipe(buyBuilding, newBuilding).pipe(closePurchasePanel).dispatch();
    this.controller.ok();
  }

  public destroyBuilding() {
    this.store.pipe(destroyBuilding, this.tileBuilding.tileId).pipe(closePurchasePanel).dispatch();
    this.controller.ok();
  }

  public reinforceBuilding() {
    this.store.pipe(reinforceTileBuilding, this.tileBuilding.tileId).pipe(closePurchasePanel).dispatch();
    this.controller.ok();
  }

  public closePanel() {
    this.store.dispatch(closePurchasePanel);
    this.controller.cancel();
  }
}
