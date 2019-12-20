import { autoinject } from "aurelia-framework";
import { connectTo, Store } from "aurelia-store";
import { map } from "rxjs/operators";

import { rollDice, State } from "../store/index";

@autoinject()
@connectTo((state: Store<State>) => state.state.pipe(
  map((value) => ({ lastDiceRoll: value.lastDiceRoll, turn: value.turn }))
))
export class Dice {

  constructor(private store: Store<State>) {

  }

  public rollDice() {
    this.store.dispatch(rollDice);
  }
}
