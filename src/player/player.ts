import { bindable } from "aurelia-framework";

export class Player {
  @bindable public currentTileId: string;
  @bindable public name: string;
}
