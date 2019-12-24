import { FrameworkConfiguration } from "aurelia-framework";

import { CommandBar } from "./command-bar";
import { Dice } from "./dice";
import { ResourcesOverview } from "./resources-overview";
import { Save } from "./save";

export function configure(config: FrameworkConfiguration) {
  config.globalResources([
    CommandBar,
    Dice,
    ResourcesOverview,
    Save
  ]);
}
