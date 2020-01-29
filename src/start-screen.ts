import { Aurelia, autoinject } from "aurelia-framework";
import { Store } from "aurelia-store";

import { addPlayer } from "./store/actions/commands";
import { State } from "./store/state";

@autoinject()
export class StartScreen {
  public playerName: string = "";

  constructor(
    private store: Store<State>,
    private au: Aurelia
  ) {
    this.store.registerAction("Start game", startGame);
    this.store.registerAction("Add a player", addPlayer);
  }

  public startGame($event?: MouseEvent) {
    if (($event?.target as HTMLElement).tagName === "INPUT" || !this.playerName || this.playerName.trim() === "") {
      return false;
    }

    this.store.pipe(addPlayer, this.playerName).pipe(startGame).dispatch();
    this.au.setRoot("./app");
  }
}

export function startGame(state: State): State {
  return {
    ...state,
    gameStarted: true
  };
}
