import { autoinject, bindable, computedFrom } from "aurelia-framework";
import { Store } from "aurelia-store";

import { Player } from "../player/player";
import { State, openPurchaseForTile } from "../store/index";
import { TileBuilding } from "buildings/tile-building";

export type TileType = "wood" | "stone" | "food" | "gold" | "iron" | "coal" | "mana" | "blood"; 
export type TilePlacement = "bottom" | "left" | "top" | "right";
export type TileRing = "inner" | "outer";

@autoinject()
export class Tile {
  @bindable public type: TileType;
  @bindable public placement: TilePlacement;
  @bindable public isCorner: boolean = false;
  @bindable public ring: "inner" | "outer";
  @bindable public players?: Player[] = [];
  @bindable public tileBuildings?: TileBuilding[] = [];
  @bindable public id: string;

  constructor(private store: Store<State>) {

  }

  @computedFrom("players")
  public get isPlayerOnTile() {
    return this.players?.filter(p => p.currentTile.id === this.id).length > 0;
  }

  @computedFrom("tileBuildings")
  public get isBuildingOnTile() {
    return this.tileBuildings?.filter(b => b.tile.id === this.id).length > 0;
  }

  public openPurchasePanel() {
    this.store.dispatch(openPurchaseForTile, this);
  }
}
