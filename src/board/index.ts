import { FrameworkConfiguration } from "aurelia-framework";
import { Board } from "./board";
import { Tile } from "./tile";
import { Tragedy } from "./tragedy";

export function configure(config: FrameworkConfiguration) {
  config.globalResources([
    Tile,
    Board,
    Tragedy
  ]);
}
