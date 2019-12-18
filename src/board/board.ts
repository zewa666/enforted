import { autoinject } from "aurelia-framework";
import { Store } from "aurelia-store";
import { Subscription } from "rxjs";

import { Tile, TilePlacement, TileRing } from "./tile";
import { State } from "../store/index";

@autoinject()
export class Board {
  public state: State;
  private subscription: Subscription;

  constructor(private store: Store<State>) {
    this.subscription = this.store.state.subscribe((state) => this.state = state);
  }

  public getTiles(ring: TileRing, placement: TilePlacement) {
    return this.state.tiles.filter(t => t.placement === placement && t.ring === ring);
  }

  public getPlayersOnTile(tile: Tile) {
    return this.state.players.filter(p => p.currentTile === tile);
  }

  public detached() {
    this.subscription.unsubscribe();
  }
}
