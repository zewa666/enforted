import { autoinject, bindable, computedFrom } from "aurelia-framework";
import { Store } from "aurelia-store";

import { WebAnimationAnimator } from "../animator/animator";
import { ConstructionPanel } from "../buildings/construction-panel";
import { PurchasePanel } from "../buildings/purchase-panel";
import { TileBuilding } from "../buildings/tile-building";
import { Player } from "../player/player";
import { openPurchaseForTile, Resources, State } from "../store/index";
import { openDialog } from "../utils/utils";
import { Tragedy } from "./tragedy";

export type TileType = "wood"
  | "stone"
  | "food"
  | "gold"
  | "iron"
  | "coal"
  | "mana"
  | "blood"
  | "start"
  | "sacred_grounds"
  | "construction-site"
  | "tragedy";

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

  constructor(
    private store: Store<State>,
    private animator: WebAnimationAnimator,
    private element: Element
  ) { }

  public async playersChanged() {
    if (this.type === "tragedy" && this.isPlayerOnTile) {
      this.animator.animate(this.element, {
        backgroundColor: ["transparent", "red", "transparent", "red"]
      }, 2000);
      await openDialog(Tragedy, {
        view: "board/tragedy.html"
      }, true);
    }
  }

  @computedFrom("players")
  public get isPlayerOnTile() {
    return this.players?.filter((p) => p.currentTileId === this.id).length > 0;
  }

  @computedFrom("tileBuildings")
  public get isBuildingOnTile() {
    return this.tileBuildings?.filter((b) => b.tileId === this.id).length > 0;
  }

  public get tileBuilding() {
    return this.tileBuildings?.find((b) => b.tileId === this.id);
  }

  public async openPurchasePanel() {
    if (!["start", "tragedy", "construction-site"].includes(this.type) && this.isPlayerOnTile) {
      await this.store.dispatch(openPurchaseForTile, this);

      openDialog(PurchasePanel, {
        resources: this.resources,
        tile: this,
        tileBuilding: this.tileBuildings?.find((b) => b.tileId === this.id),
        view: "buildings/purchase-panel.html",
      });
    } else if (this.type === "construction-site" && this.isPlayerOnTile) {
      openDialog(ConstructionPanel, {
        resources: this.resources,
        view: "buildings/construction-panel.html",
      });
    }
  }
}
