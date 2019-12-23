import { autoinject, bindable, computedFrom } from "aurelia-framework";
import { Store } from "aurelia-store";

import { PurchasePanel } from "../buildings/purchase-panel";
import { TileBuilding } from "../buildings/tile-building";
import { Player } from "../player/player";
import { openPurchaseForTile, Resources, State } from "../store/index";
import { openDialog } from "../utils/utils";

export type TileType = "wood"
  | "stone"
  | "food"
  | "gold"
  | "iron"
  | "coal"
  | "mana"
  | "blood"
  | "start"
  | "sacred_grounds";

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
  @bindable public resources: Resources;

  constructor(private store: Store<State>) {

  }

  @computedFrom("players")
  public get isPlayerOnTile() {
    return this.players?.filter((p) => p.currentTile.id === this.id).length > 0;
  }

  @computedFrom("tileBuildings")
  public get isBuildingOnTile() {
    return this.tileBuildings?.filter((b) => b.tile.id === this.id).length > 0;
  }

  public async openPurchasePanel() {
    if (this.type !== "start" && this.isPlayerOnTile) {
      await this.store.dispatch(openPurchaseForTile, this);

      openDialog(PurchasePanel, {
        resources: this.resources,
        tile: this,
        tileBuilding: this.tileBuildings?.find((b) => b.tile.id === this.id),
        view: "buildings/purchase-panel.html",
      });
    }
  }
}
