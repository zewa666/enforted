import { FrameworkConfiguration } from 'aurelia-framework';
import { Tile } from './tile';
import { Board } from './board';

export function configure(config: FrameworkConfiguration) {
  config.globalResources([
    Tile,
    Board
  ]);
}
