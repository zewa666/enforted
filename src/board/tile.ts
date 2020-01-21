import { autoinject, bindable, computedFrom } from "aurelia-framework";
import { Store } from "aurelia-store";
import { capitalize } from "lodash";

import { WebAnimationAnimator } from "../animator/animator";
import { ConstructionPanel } from "../buildings/construction-panel";
import { PurchasePanel } from "../buildings/purchase-panel";
import { TileBuilding } from "../buildings/tile-building";
import { Monster } from "../monster/monster";
import { Player } from "../player/player";
import { Resources, Stats } from "../resources/index";
import { openPurchaseForTile, State } from "../store/index";
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
  | "tragedy"
  | "fire_fountain";

export type TilePlacement = "bottom" | "left" | "top" | "right";
export type TileRing = "inner" | "outer";

@autoinject()
export class Tile {
  @bindable public type: TileType;
  @bindable public placement: TilePlacement;
  @bindable public isCorner: boolean = false;
  @bindable public ring: "inner" | "outer";
  @bindable public players?: Player[] = [];
  @bindable public monsters?: Monster[] = [];
  @bindable public tileBuildings?: TileBuilding[] = [];
  @bindable public id: string;
  @bindable public resources: Resources;
  @bindable public stats: Stats;

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
      }, "Enter");
    }
  }

  @computedFrom("players")
  public get isPlayerOnTile() {
    return this.players?.filter((p) => p.currentTileId === this.id).length > 0;
  }

  @computedFrom("monsters")
  public get monstersOnTile() {
    return this.monsters?.filter((p) => p.currentTileId === this.id);
  }

  @computedFrom("tileBuildings")
  public get isBuildingOnTile() {
    return this.tileBuildings?.filter((b) => b.tileId === this.id).length > 0;
  }

  @computedFrom("type")
  public get typeName() {
    return capitalize(this.type.replace(/_/g, " "));
  }

  public get tileBuilding() {
    return this.tileBuildings?.find((b) => b.tileId === this.id);
  }

  public async openPurchasePanel() {
    if (!["start", "tragedy", "construction-site", "fire_fountain"].includes(this.type) && this.isPlayerOnTile) {
      await this.store.dispatch(openPurchaseForTile, this);

      openDialog(PurchasePanel, {
        resources: this.resources,
        stats: this.stats,
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
