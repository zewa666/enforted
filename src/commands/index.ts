import { FrameworkConfiguration } from 'aurelia-framework';

import { CommandBar } from "./command-bar";
import { Dice } from "./dice";

export function configure(config: FrameworkConfiguration) {
  config.globalResources([
    CommandBar,
    Dice
  ]);
}
