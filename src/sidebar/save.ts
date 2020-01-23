import { autoinject } from "aurelia-framework";
import { Store } from "aurelia-store";

import { initialState, LOCALSTORAGE_SAVE_KEY, State } from "../store/state";

@autoinject()
export class Save {

  constructor(private store: Store<State>) { }

  public newGame() {
    this.store.resetToState(initialState);
    window.localStorage.removeItem(LOCALSTORAGE_SAVE_KEY);
    window.location.reload();
  }

  public saveGame() {
    const data = new Blob([window.localStorage.getItem(LOCALSTORAGE_SAVE_KEY) || JSON.stringify(initialState)], { type: "application/json" });
    const url = window.URL.createObjectURL(data);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.target = "_blank";
    anchor.download = "enforted-save.json";
    anchor.click();

    window.URL.revokeObjectURL(url);
  }
}
