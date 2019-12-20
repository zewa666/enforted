import { FrameworkConfiguration } from "aurelia-framework";
import { Board } from "./board";
import { Tile } from "./tile";

export function configure(config: FrameworkConfiguration) {
  config.globalResources([
    Tile,
    Board
  ]);
}
