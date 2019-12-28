import { DialogController } from "aurelia-dialog";
import { autoinject } from "aurelia-framework";
import { Store } from "aurelia-store";
import { take } from "rxjs/operators";

import {
  ragingFire,
  sacrificeResources
} from "../store/actions/tragedy-events";
import { randBetween } from "../store/helper";
import { State } from "../store/state";
import { DialogModel } from "../utils/utils";

@autoinject()
export class Tragedy {
  public dialogView?: string;
  public bemclasses?: string;
  public event?: TragedyEvent;
  public state: State;

  constructor(
    public store: Store<State>,
    public controller: DialogController
  ) { }

  public activate(model: DialogModel) {
    this.dialogView = model.view;
    this.bemclasses = model.bem;

    // only subscribe for one state so we don't run into rerender cycles
    this.store.state.pipe(take(1)).subscribe((state) => {
      this.state = state;

      if (this.state.activeTragedy !== undefined) {
        this.event = {
          effect: () => `You beared more tragedy than a poor soul can handle`,
          event: -1,
          image: "prayer",
          name: "No more tragedy",
          weight: 0,
        } as TragedyEvent;
      } else {
        this.drawRandomTragedyEvent();
      }
    });
  }

  private drawRandomTragedyEvent() {
    let sum = 0;
    const r = Math.random();
    const probability: { [key: number]: number } = tragedyEvents.reduce((acc, curr, idx) => {
      acc[idx] = curr.weight;

      return acc;
    }, {});

    for (const i in probability) {
      if (probability.hasOwnProperty(i)) {
        sum += probability[i];
        if (r <= sum) {
          this.event = tragedyEvents[parseInt(i.toString(), 10)];
          break;
        }
      }
    }
  }
}

export enum AvailableTragedyEvents {
  Sacrifice,
  RagingFire,
  StumblingSteps,
  ForgottenEquipment,
  DefiledAltar,
  CollapsedMines,
  Vermins,
  Rockfall,
  ShatteringEarth,
  BurningTrees,
  ContaminatedBlood
}

export interface TragedyEvent {
  /**
   * defines the probability this event gets picked
   * Must be lower 1. Sum of all weights must be 1
   */
  weight: number;
  name: string;
  image: string;
  event: AvailableTragedyEvents;
  /**
   * performs the events effects and returns the description
   */
  effect: (store: Store<State>, state: State) => string;
}

export const tragedyEvents: TragedyEvent[] = [
  {
    effect: (store, state) => {
      const amount = randBetween(1, 4);
      const availableResources = Object.keys(state.resources)
        .filter((r) => state.resources[r] > 0);
      const resourceType = availableResources[randBetween(0, availableResources.length - 1)];
      const description = `In order to please the gods you sacrifice ${amount} of your ${resourceType}.`;

      store.dispatch(sacrificeResources, resourceType, amount);

      return description;
    },
    event: AvailableTragedyEvents.Sacrifice,
    image: "sacrificial-dagger",
    name: "A sacrifice for the gods",
    weight: 0.08
  },
  {
    effect: (store, state) => {
      if (state.tileBuildings.length === 0) {
        return "A building burned to the ground, but luckily it was none of yours.";
      }

      const targetBuilding = state.tileBuildings[randBetween(0, state.tileBuildings.length - 1)];
      const description = `A fire broke out! Your ${targetBuilding.type} burned to the ground.`;

      store.dispatch(ragingFire, targetBuilding.tileId);

      return description;
    },
    event: AvailableTragedyEvents.RagingFire,
    image: "small-fire",
    name: "Raging fire",
    weight: 0.07
  },
  {
    effect: (store, state) => {
      return "Your last nights tavern demands it's toll. Your next dice rolls are wonky single steps.";
    },
    event: AvailableTragedyEvents.StumblingSteps,
    image: "beer-stein",
    name: "Stumbling steps",
    weight: 0.12
  },
  {
    effect: (store, state) => {
      return "You were in such a hurry rushing for the adventure leaving your essentials at the door steps. Go back to the start of your journey and get them.";
    },
    event: AvailableTragedyEvents.ForgottenEquipment,
    image: "bindle",
    name: "The forgotten equipment",
    weight: 0.11
  },
  {
    effect: (store, state) => {
      return "Strangers have been seen, defiling one of your shrines. 'Tis your duty to rebuild them in full glory.";
    },
    event: AvailableTragedyEvents.DefiledAltar,
    image: "broken-tablet",
    name: "Defiled altar",
    weight: 0.07
  },
  {
    effect: (store, state) => {
      const mineType = "";
      const description = `Men screamed and shouted, sealed in the dark groves of your ${mineType}. Poor devils souls, for their life found it's end in the dark.`;

      return description;
    },
    event: AvailableTragedyEvents.CollapsedMines,
    image: "oppression",
    name: "Collapsed mines",
    weight: 0.10
  },
  {
    effect: (store, state) => {
      return `Your mills got pested by pesky vermins. Until the mess is cleaned no food may be produced.`;
    },
    event: AvailableTragedyEvents.Vermins,
    image: "rat",
    name: "Plague of vermins",
    weight: 0.09
  },
  {
    effect: (store, state) => {
      return `Those giant boulders set loose and burried few of your men. It will take a while until the next shipment is ready.`;
    },
    event: AvailableTragedyEvents.Rockfall,
    image: "falling-rocks",
    name: "The rockfall",
    weight: 0.09
  },
  {
    effect: (store, state) => {
      return `A mighty earth quake shattered your mana rifts. It is nature that shows it's endless power. It will take a wihle until further veils can be casted.`;
    },
    event: AvailableTragedyEvents.ShatteringEarth,
    image: "earth-spit",
    name: "Shattering earth",
    weight: 0.09
  },
  {
    effect: (store, state) => {
      return `A morron with a torch, none of wisdom on his porch, set ablaze your woods. No more lumber is going soon to find the routes.`;
    },
    event: AvailableTragedyEvents.BurningTrees,
    image: "burning-tree",
    name: "Burning trees",
    weight: 0.09
  },
  {
    effect: (store, state) => {
      return `One of the corpses was filled with evil gazes. It will take a while to harvest another crop.`;
    },
    event: AvailableTragedyEvents.ContaminatedBlood,
    image: "infested-mass",
    name: "Contaminated blood",
    weight: 0.09
  }
];
