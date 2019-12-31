import { DialogController } from "aurelia-dialog";
import { autoinject, bindable, computedFrom } from "aurelia-framework";
import { Store } from "aurelia-store";
import { capitalize } from "lodash";

import { Resources, ResourcesIcons, State } from "../store/index";
import { DialogModel } from "../utils/utils";
import {
  AllFortressBuildings,
  FortressBuildingIcon,
  FortressBuildingResourceCost
} from "./fortress-building";
import { PurchasePanel } from "./purchase-panel";

@autoinject()
export class ConstructionPanel {
  @bindable() public resources: Resources;
  public dialogView: string;
  public bemclasses: string;
  public currentBuildingIdx = 0;

  private fortressBuildings;

  constructor(
    private store: Store<State>,
    public controller: DialogController
  ) { }

  @computedFrom("currentBuildingIdx")
  public get building() {
    return this.fortressBuildings[this.currentBuildingIdx];
  }

  public activate(model: PurchasePanel & DialogModel) {
    this.resources = model.resources;
    this.dialogView = model.view;
    this.bemclasses = model.bem;
    this.fortressBuildings = AllFortressBuildings.map((b) => {
      const buildingCosts = Object.entries<number>(FortressBuildingResourceCost[b]).filter((r) => r[1] !== 0);
      const costs = buildingCosts.map((e) => ({
        icon: ResourcesIcons[e[0]],
        resource: e[0],
        value: e[1],
      }));

      return {
        costs,
        icon: FortressBuildingIcon[b],
        name: capitalize(b.replace(/_/g, " ")),
        sufficientResources: !costs.some((c) => this.resources[c.resource] - c.value < 0),
        type: b
      };
    });
  }

  public closePanel() {
    this.controller.cancel();
  }

  public toggleBuilding(direction: "-" | "+") {
    if (direction === "+") {
      this.currentBuildingIdx = (this.currentBuildingIdx + 1) > (this.fortressBuildings.length - 1)
        ? 0
        : this.currentBuildingIdx + 1;
    } else {
      this.currentBuildingIdx = (this.currentBuildingIdx - 1) < 0
        ? this.fortressBuildings.length - 1
        : this.currentBuildingIdx - 1;
    }
  }

  public buyBuilding() {
    // TODO: implement buy
  }
}
