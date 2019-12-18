import { autoinject, bindable } from "aurelia-framework";
import { Tile } from "../board/tile";

@autoinject()
export class Player {
  @bindable public currentTile: Tile;
}
