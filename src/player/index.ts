import { FrameworkConfiguration } from 'aurelia-framework';

import { Player } from "./player";

export function configure(config: FrameworkConfiguration) {
  config.globalResources([
    Player
  ]);
}
