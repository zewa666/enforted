import { FrameworkConfiguration } from "aurelia-framework";
import { Board } from "./board";
import { Fortress } from "./fortress";
import { GameOver } from "./game-over";
import { Tile } from "./tile";
import { Tragedy } from "./tragedy";

export function configure(config: FrameworkConfiguration) {
  config.globalResources([
    Board,
    Fortress,
    GameOver,
    Tile,
    Tragedy
  ]);
}
