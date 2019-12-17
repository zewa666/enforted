import { bindable } from "aurelia-framework";

export type TileType = "wood" | "stone" | "food" | "gold" | "iron" | "coal" | "mana" | "blood"; 
export type TilePlacement = "bottom" | "left" | "top" | "right";
export type TileRing = "inner" | "outer";

export class Tile {
  @bindable public type: TileType;
  @bindable public placement: TilePlacement;
  @bindable public isCorner: boolean = false;
  @bindable public ring: "inner" | "outer";
}
