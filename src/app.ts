import { autoinject } from "aurelia-framework";
import { Store } from "aurelia-store";

import {
  buyBuilding,
  closePurchasePanel,
  openPurchaseForTile,
  rollDice,
  State
} from "./store/index";

@autoinject()
export class App {
  constructor(private store: Store<State>) {
    this.store.registerAction("roll the dice", rollDice);
    this.store.registerAction("open the purchase panel", openPurchaseForTile);
    this.store.registerAction("close the purchase panel", closePurchasePanel);
    this.store.registerAction("buy a tile building", buyBuilding);
  }

  public attached() {
    window.addEventListener("keyup", this.handleGlobalKeys);
  }

  public detached() {
    window.removeEventListener("keyup", this.handleGlobalKeys);
  }

  private handleGlobalKeys = (event: KeyboardEvent) => {
    if (event.keyCode === 13) {
      this.store.dispatch(rollDice);
    }
  }
}
