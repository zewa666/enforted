import { FrameworkConfiguration } from "aurelia-framework";

import { CommandBar } from "./command-bar";
import { Dice } from "./dice";
import { Resources } from "./resources";

export function configure(config: FrameworkConfiguration) {
  config.globalResources([
    CommandBar,
    Dice,
    Resources
  ]);
}
