import { autoinject } from "aurelia-framework";
import { Store, connectTo } from "aurelia-store";
import { pluck } from "rxjs/operators";

import { State, rollDice } from "../store/index";

@autoinject()
@connectTo((state) => state.state.pipe(pluck("lastDiceRoll")))
export class Dice {

  constructor(private store: Store<State>) {
    
  }
  
  public rollDice() {
    this.store.dispatch(rollDice);
  }
}
