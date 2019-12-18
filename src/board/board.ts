import { Tile, TilePlacement, TileRing } from "./tile";
import { Player } from "../player/player";

export class Board {
  private players: Player[] = [];
  private tiles: Tile[] = [
    ...Array.from<Tile, Tile>(Array(11), (_, idx) => ({
      type: "wood",
      placement: "bottom",
      isCorner: idx === 0 || idx === 10,
      ring: "outer"
    })),
    ...Array.from<Tile, Tile>(Array(9), () => ({
      type: "food",
      placement: "left",
      isCorner: false,
      ring: "outer"
    })),
    ...Array.from<Tile, Tile>(Array(11), (_, idx) => ({
      type: "stone",
      placement: "top",
      isCorner: idx === 0 || idx === 10,
      ring: "outer"
    })),
    ...Array.from<Tile, Tile>(Array(9), () => ({
      type: "gold",
      placement: "right",
      isCorner: false,
      ring: "outer"
    })),
    ...Array.from<Tile, Tile>(Array(11), (_, idx) => ({
      type: "iron",
      placement: "bottom",
      isCorner: idx === 0 || idx === 10,
      ring: "inner"
    })),
    ...Array.from<Tile, Tile>(Array(9), () => ({
      type: "mana",
      placement: "left",
      isCorner: false,
      ring: "inner"
    })),
    ...Array.from<Tile, Tile>(Array(11), (_, idx) => ({
      type: "coal",
      placement: "top",
      isCorner: idx === 0 || idx === 10,
      ring: "inner"
    })),
    ...Array.from<Tile, Tile>(Array(9), () => ({
      type: "blood",
      placement: "right",
      isCorner: false,
      ring: "inner"
    })),
  ];

  constructor() {
    const player = new Player();
    player.name = "zewa";
    player.currentTile = this.tiles[0];
    this.players.push(player);
  }

  public getTiles(ring: TileRing, placement: TilePlacement) {
    return this.tiles.filter(t => t.placement === placement && t.ring === ring);
  }

  public getPlayersOnTile(tile: Tile) {
    return this.players.filter(p => p.currentTile === tile);
  }
}
