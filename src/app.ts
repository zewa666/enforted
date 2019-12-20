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
}
