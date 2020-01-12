import { FrameworkConfiguration } from "aurelia-framework";

import { Monster } from "./monster";

export function configure(config: FrameworkConfiguration) {
  config.globalResources([
    Monster
  ]);
}
