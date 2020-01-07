import { autoinject } from "aurelia-framework";
import { connectTo, Store } from "aurelia-store";
import { map } from "rxjs/operators";

import { WebAnimationAnimator } from "../animator/animator";
import { rollDice, State } from "../store/index";

@autoinject()
@connectTo((state: Store<State>) => state.state.pipe(
  map((value) => ({ lastDiceRoll: value.lastDiceRoll, round: value.round }))
))
export class Dice {

  constructor(
    private store: Store<State>,
    private animator: WebAnimationAnimator
  ) { }

  public async rollDice() {
    const playerOldRect = document.querySelector("player").getBoundingClientRect();
    await this.store.dispatch(rollDice);

    const playerNewPos = document.querySelector("player");
    const playerNewCompStyle = window.getComputedStyle(playerNewPos);
    const playerNewBoundingRect = playerNewPos.getBoundingClientRect();
    const topAdjust = parseInt(playerNewCompStyle.top.replace("px", ""), 10);
    const leftAdjust = parseInt(playerNewCompStyle.left.replace("px", ""), 10);

    await this.animator.animate(playerNewPos, {
      left: [
        `${Math.ceil(playerOldRect.x - playerNewBoundingRect.x + leftAdjust)}px`,
       playerNewCompStyle.left
      ],
      top: [
        `${Math.ceil(playerOldRect.y - playerNewBoundingRect.y + topAdjust)}px`,
        playerNewCompStyle.top
      ],
    }, 150);
  }
}
