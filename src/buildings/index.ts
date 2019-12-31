import { FrameworkConfiguration } from "aurelia-framework";
import { ConstructionPanel } from "./construction-panel";
import { FortressBuilding } from "./fortress-building";
import { PurchasePanel } from "./purchase-panel";
import { TileBuilding } from "./tile-building";

export function configure(config: FrameworkConfiguration) {
  config.globalResources([
    ConstructionPanel,
    FortressBuilding,
    PurchasePanel,
    TileBuilding
  ]);
}
