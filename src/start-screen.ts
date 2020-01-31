import createAuth0Client from "@auth0/auth0-spa-js";
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

  public async loginWithGithub() {
    const auth0 = await createAuth0Client({
      client_id: "wtxHvxLecRBpapZwvSXMMmZsZ8fEEEzI",
      domain: "enforted.eu.auth0.com",
    });

    await auth0.loginWithPopup();
    const user = await auth0.getUser();

    this.start(user.nickname);
  }

  public startGame($event?: MouseEvent) {
    if (($event?.target as HTMLElement)?.tagName === "INPUT" || !this.playerName || this.playerName.trim() === "") {
      return false;
    }

    this.start(this.playerName);
  }

  private start(name: string) {
    this.store.pipe(addPlayer, name).pipe(startGame).dispatch();
    this.au.setRoot("./app");
  }
}

export function startGame(state: State): State {
  return {
    ...state,
    gameStarted: true
  };
}
