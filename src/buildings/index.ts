import { FrameworkConfiguration } from 'aurelia-framework';
import { PurchasePanel } from './purchase-panel';

export function configure(config: FrameworkConfiguration) {
  config.globalResources([
    PurchasePanel
  ]);
}
