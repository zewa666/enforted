import { FrameworkConfiguration } from "aurelia-framework";

import { BuildOverview } from "./build-overview";
import { Dice } from "./dice";
import { ResourcesOverview } from "./resources-overview";
import { Save } from "./save";
import { Sidebar } from "./sidebar";
import { TragedyOverview } from "./tragedy-overview";

export function configure(config: FrameworkConfiguration) {
  config.globalResources([
    Sidebar,
    BuildOverview,
    Dice,
    ResourcesOverview,
    Save,
    TragedyOverview
  ]);
}
