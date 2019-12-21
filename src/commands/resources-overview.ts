import { computedFrom } from "aurelia-framework";
import { connectTo } from "aurelia-store";
import { pluck } from "rxjs/operators";

import { Resources, ResourcesIcons } from "../store/state";
import { ucFirst } from "../utils/utils";

@connectTo((store) => store.state.pipe(pluck("resources")))
export class ResourcesOverview {
  public state: Resources;

  @computedFrom("state")
  public get resources() {
    if (!this.state) {
      return [];
    }

    return Object.entries(this.state)
      .map((e) => ({
        icon: ResourcesIcons[e[0]],
        name: ucFirst(e[0]),
        value: e[1],
      }));
  }
}
