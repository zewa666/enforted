import { DialogController } from "aurelia-dialog";
import { autoinject } from "aurelia-framework";

import { DialogModel } from "../utils/utils";

@autoinject()
export class Tragedy {
  public dialogView?: string;
  public bemclasses?: string;

  constructor(
    // private store: Store<State>,
    public controller: DialogController
  ) { }

  public activate(model: DialogModel) {
    this.dialogView = model.view;
    this.bemclasses = model.bem;
  }
}
