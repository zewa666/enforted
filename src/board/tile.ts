import { autoinject, bindable, computedFrom } from "aurelia-framework";
import { Player } from "../player/player";

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
  @bindable public id: string;

  @computedFrom("players")
  public get isPlayerOnTile() {
    return this.players?.filter(p => p.currentTile.id === this.id).length > 0;
  }
}
