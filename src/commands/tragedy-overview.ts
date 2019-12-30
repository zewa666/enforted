import { computedFrom } from "aurelia-framework";
import { connectTo } from "aurelia-store";
import { pluck } from "rxjs/operators";

import { AvailableTragedyEvents, tragedyEvents } from "../board/tragedy";

@connectTo((store) => store.state.pipe(pluck("activeTragedy")))
export class TragedyOverview {
  public state: AvailableTragedyEvents;

  @computedFrom("state")
  public get tragedy() {
    return tragedyEvents.find((te) => te.event === this.state);
  }
}
