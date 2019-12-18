import { autoinject } from "aurelia-framework";
import { Store } from "aurelia-store";

import { State, rollDice } from "./store/index";

@autoinject()
export class App {
  constructor(private store: Store<State>) {
    this.store.registerAction("roll the dice", rollDice);
  }
}
