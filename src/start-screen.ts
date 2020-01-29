import { Aurelia, autoinject } from "aurelia-framework";
import { Store } from "aurelia-store";

import { State } from "./store/state";

@autoinject()
export class StartScreen {
  constructor(
    private store: Store<State>,
    private au: Aurelia
  ) {
    this.store.registerAction("Start game", startGame);
  }

  public startGame() {
    this.store.dispatch(startGame);
    this.au.setRoot("./app");
  }
}

export function startGame(state: State): State {
  return {
    ...state,
    gameStarted: true
  };
}
