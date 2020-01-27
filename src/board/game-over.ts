import { autoinject } from "aurelia-framework";
import { Store } from "aurelia-store";

import {
  initialState,
  LOCALSTORAGE_SAVE_KEY,
  State
} from "../store/index";
import { DialogModel } from "../utils/utils";

@autoinject()
export class GameOver {
  public dialogView: string;
  public bemclasses: string;

  constructor(
    private store: Store<State>
  ) { }

  public newGame() {
    this.store.resetToState(initialState);
    window.localStorage.removeItem(LOCALSTORAGE_SAVE_KEY);
    window.location.reload();
  }

  public activate(model: GameOver & DialogModel) {
    this.dialogView = model.view;
    this.bemclasses = model.bem;
  }
}
