import { FrameworkConfiguration } from 'aurelia-framework';
import { PurchasePanel } from './purchase-panel';
import { TileBuilding } from './tile-building';

export function configure(config: FrameworkConfiguration) {
  config.globalResources([
    PurchasePanel,
    TileBuilding
  ]);
}
