import { bindable } from "aurelia-framework";

export type TileType = "wood" | "stone" | "iron" | "gold"; 
export type TilePlacement = "bottom" | "left" | "top" | "right";

export class Tile {
  @bindable public type: TileType;
  @bindable public placement: TilePlacement;
  @bindable public isCorner: boolean = false;
}
