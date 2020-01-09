import { TileType } from "../board/tile";

export type ResourceTileType = Exclude<TileType, "start" | "tragedy" | "sacred_grounds" | "construction-site">;
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
