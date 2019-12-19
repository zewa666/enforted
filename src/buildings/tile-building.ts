import { bindable, computedFrom } from "aurelia-framework";
import { Tile } from "../board/tile";
import { Resources } from "../store/state";

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

export const TileBuildingResourceCost: {
  [key in AvailableTileBuildings]: Resources;
} = {
  sawmill: {
    blood: 0, coal: 0, food: 0, iron: 0, mana: 0, stone: 0,
    gold: 10,
    wood: 5
  },
  quarry: {
    blood: 0, coal: 0, food: 0, iron: 0, mana: 0, stone: 0,
    gold: 15,
    wood: 10
  },
  farm: {
    blood: 0, coal: 0, food: 0, iron: 0, mana: 0, stone: 0,
    gold: 10,
    wood: 20
  },
  gold_mine: {
    blood: 0, coal: 0, iron: 0, mana: 0, stone: 0,
    food: 10,
    gold: 10,
    wood: 15
  },
  iron_mine: {
    blood: 0, coal: 0, food: 0, iron: 0, mana: 0, stone: 0,
    gold: 10,
    wood: 10
  },
  mana_rift: {
    blood: 0, coal: 0, food: 0, iron: 0, mana: 0, stone: 0,
    gold: 10,
    wood: 10
  },
  butchery: {
    blood: 0, coal: 0, food: 0, iron: 0, mana: 0, stone: 0,
    gold: 10,
    wood: 10
  },
  coal_mine: {
    blood: 0, coal: 0, food: 0, iron: 0, mana: 0, stone: 0,
    gold: 10,
    wood: 10
  }
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
