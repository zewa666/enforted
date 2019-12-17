import { computedFrom } from "aurelia-framework";

import { Tile } from "./tile";

export class Board {
  private tiles: Tile[] = [
    ...Array.from<Tile, Tile>(Array(11), (_, idx) => ({
      type: "wood",
      placement: "bottom",
      isCorner: idx === 0 || idx === 10
    })),
    ...Array.from<Tile, Tile>(Array(9), () => ({
      type: "stone",
      placement: "left",
      isCorner: false
    })),
    ...Array.from<Tile, Tile>(Array(11), (_, idx) => ({
      type: "iron",
      placement: "top",
      isCorner: idx === 0 || idx === 10
    })),
    ...Array.from<Tile, Tile>(Array(9), () => ({
      type: "gold",
      placement: "right",
      isCorner: false
    })),
  ];

  @computedFrom("tiles")
  public get tilesTop() {
    return this.tiles.filter(t => t.placement === "top");
  }

  @computedFrom("tiles")
  public get tilesRight() {
    return this.tiles.filter(t => t.placement === "right");
  }

  @computedFrom("tiles")
  public get tilesBottom() {
    return this.tiles.filter(t => t.placement === "bottom");
  }

  @computedFrom("tiles")
  public get tilesLeft() {
    return this.tiles.filter(t => t.placement === "left");
  }

}
