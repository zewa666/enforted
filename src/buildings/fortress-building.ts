import { bindable, computedFrom } from "aurelia-framework";
import { capitalize } from "lodash";

import { Resources } from "../store/state";

export const AllFortressBuildings = [
  "blacksmith_shop",
  "magician_tower",
  "bakery",
  "palisades",
  "bank"
] as const;

export type AvailableFortressBuildings = (typeof AllFortressBuildings)[number];

export enum FortressBuildingIcon {
  bakery = "dough-roller",
  bank = "gold-stack",
  blacksmith_shop = "anvil",
  magician_tower = "evil-tower",
  palisades = "palisade"
}

export const FortressBuildingResourceCost: {
  [key in AvailableFortressBuildings]: Resources;
} = {
  bakery: {
    blood: 0,
    coal: 0,
    food: 10,
    gold: 10,
    iron: 0,
    mana: 0,
    stone: 10,
    wood: 10
  },
  bank: {
    blood: 0,
    coal: 0,
    food: 10,
    gold: 10,
    iron: 0,
    mana: 0,
    stone: 10,
    wood: 10
  },
  blacksmith_shop: {
    blood: 0,
    coal: 0,
    food: 10,
    gold: 10,
    iron: 0,
    mana: 0,
    stone: 10,
    wood: 10
  },
  magician_tower: {
    blood: 0,
    coal: 0,
    food: 10,
    gold: 10,
    iron: 0,
    mana: 0,
    stone: 10,
    wood: 10
  },
  palisades: {
    blood: 0,
    coal: 0,
    food: 10,
    gold: 10,
    iron: 0,
    mana: 0,
    stone: 10,
    wood: 10
  }
};

export class FortressBuilding {
  @bindable() public type: AvailableFortressBuildings;

  @computedFrom("type")
  public get icon(): string {
    return FortressBuildingIcon[this.type];
  }

  @computedFrom("type")
  public get name(): string {
    return capitalize(this.type.replace(/_/g, " "));
  }
}
