import { autoinject, bindable } from "aurelia-framework";
import { Store } from "aurelia-store";

import { Tile } from "../board/tile";
import { State } from "../store/state";

@autoinject()
export class Player {
  @bindable public currentTileId: string;
  @bindable public name: string;

  private currentTile: Tile = {} as Tile;

  constructor(private store: Store<State>) { }

  public currentTileIdChanged() {
    this.currentTile = (this.store as any)._state.getValue();
  }
}
