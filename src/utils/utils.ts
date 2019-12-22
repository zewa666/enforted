import { DialogService } from "aurelia-dialog";
import { Container } from "aurelia-framework";
import { kebabCase } from "lodash";

export interface DialogModel {
  [key: string]: any;
  /**
   * the view url (relative to src/)
   */
  view: string;
  /**
   * any BEM classes to attach
   */
  bem?: string;
}

export function openDialog(viewModel: any, model: DialogModel) {
  const dialogService = Container.instance.get(DialogService);
  model.bem = model.bem || kebabCase(viewModel.name);

  return dialogService.open({
    centerHorizontalOnly: true,
    model,
    view: "utils/generic-dialog.html",
    viewModel,
  });
}
