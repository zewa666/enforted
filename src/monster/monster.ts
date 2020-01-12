import { bindable, computedFrom } from "aurelia-framework";

export class Monster {
  @bindable public currentTileId: string;
  @bindable public type: MonsterType;
  @bindable public stats: MonsterStats;

  @computedFrom("type")
  public get icon(): string {
    return MonsterPropMap[this.type].icon;
  }
}

export const AllMonsters = [
  "Zombie",
  "Skeleton",
  "Golem",
  "Dragon"
] as const;

export type MonsterType = (typeof AllMonsters)[number];

export const MonsterPropMap: { [monster in MonsterType]: { icon: string, stats: MonsterStats } } = {
  Dragon: {
    icon: "spiked-dragon-head",
    stats: { hp: 30, dmg: 10 }
  },
  Golem: {
    icon: "rock-golem",
    stats: { hp: 35, dmg: 5 }
  },
  Skeleton: {
    icon: "harry-potter-skull",
    stats: { hp: 13, dmg: 4 }
  },
  Zombie: {
    icon: "half-body-crawling",
    stats: { hp: 10, dmg: 2 }
  },
};

export interface MonsterStats {
  hp: number;
  dmg: number;
}
