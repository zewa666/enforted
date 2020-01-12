import { bindable, computedFrom } from "aurelia-framework";

export class Monster {
  @bindable public currentTileId: string;
  @bindable public type: MonsterType;

  @computedFrom("type")
  public get icon(): string {
    return MonsterIcon[this.type];
  }
}

export const AllMonsters = [
  "Zombie",
  "Skeleton",
  "Golem",
  "Dragon"
] as const;

export type MonsterType = (typeof AllMonsters)[number];

export enum MonsterIcon {
  Zombie = "half-body-crawling",
  Skeleton = "harry-potter-skull",
  Golem = "rock-golem",
  Dragon = "spiked-dragon-head",
}
