import { FrameworkConfiguration } from "aurelia-framework";

import { Dice } from "./dice";
import { ResourcesOverview } from "./resources-overview";
import { Save } from "./save";
import { Sidebar } from "./sidebar";
import { TragedyOverview } from "./tragedy-overview";

export function configure(config: FrameworkConfiguration) {
  config.globalResources([
    Sidebar,
    Dice,
    ResourcesOverview,
    Save,
    TragedyOverview
  ]);
}
