import { TileType } from "../board/tile";

export type ResourceTileType = Exclude<TileType, "start" | "rally_point" | "tragedy" | "sacred_grounds" | "construction-site" | "fire_fountain">;
export type Resources = {
  [key in ResourceTileType]: number;
};
export const ResourcesIcons: {
  [key in ResourceTileType]: string;
} = {
  blood: "bloody-stash",
  coal: "brick-pile",
  food: "wheat",
  gold: "two-coins",
  iron: "ore",
  mana: "vortex",
  stone: "stone-block",
  wood: "forest"
};

export type Stat = "defense" | "population" | "soldiers";
export type Stats = {
  [key in Stat]: number;
};
export const StatsIcons: {
  [key in Stat]: string;
} = {
  defense: "checked-shield",
  population: "icicles-aura",
  soldiers: "sword-brandish"
};
