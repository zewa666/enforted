import { autoinject } from "aurelia-framework";
import { Store } from "aurelia-store";
import { Subscription } from "rxjs";

import { State } from "../store/index";
import { TilePlacement, TileRing } from "./tile";

@autoinject()
export class Board {
  public state: State;
  private subscription: Subscription;

  constructor(private store: Store<State>) {
    this.subscription = this.store.state.subscribe((state) => this.state = state);
  }

  public getTiles(ring: TileRing, placement: TilePlacement) {
    return this.state?.tiles?.filter((t) => t.placement === placement && t.ring === ring);
  }

  public detached() {
    this.subscription.unsubscribe();
  }
}
