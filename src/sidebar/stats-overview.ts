import { computedFrom } from "aurelia-framework";
import { connectTo } from "aurelia-store";
import { upperFirst } from "lodash";
import { pluck } from "rxjs/operators";

import { Stats, StatsIcons } from "../resources/index";

@connectTo((store) => store.state.pipe(pluck("stats")))
export class StatsOverview {
  public state: Stats;

  @computedFrom("state")
  public get stats() {
    if (!this.state) {
      return [];
    }

    return Object.entries(this.state)
      .map((e) => ({
        icon: StatsIcons[e[0]],
        name: upperFirst(e[0]),
        value: e[1],
      }));
  }
}
