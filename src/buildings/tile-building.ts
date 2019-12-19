import { bindable, computedFrom } from "aurelia-framework";
import { Tile } from "../board/tile";

export enum AvailableTileBuildings {
  sawmill = "sawmill",
  quarry = "quarry",
  farm = "farm",
  gold_mine = "gold_mine",
  iron_mine = "iron_mine",
  mana_rift = "mana_rift",
  butchery = "butchery",
  coal_mine = "coal_mine"
}

export const TileBuildingsMap = {
  wood: AvailableTileBuildings.sawmill,
  stone: AvailableTileBuildings.quarry,
  food: AvailableTileBuildings.farm,
  gold: AvailableTileBuildings.gold_mine,
  iron: AvailableTileBuildings.iron_mine,
  mana: AvailableTileBuildings.mana_rift,
  blood: AvailableTileBuildings.butchery,
  coal: AvailableTileBuildings.coal_mine
};

export class TileBuilding {
  @bindable public tile: Tile;

  @computedFrom("tile")
  public get type() {
    if (this.tile) {
      return TileBuildingsMap[this.tile.type];
    }
  }
}
