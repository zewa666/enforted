import { connectTo } from "aurelia-store";
import { State } from "../store/index";

@connectTo()
export class Fortress {
  public state: State;
}
