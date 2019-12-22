import { DialogService } from "aurelia-dialog";
import { Container } from "aurelia-framework";

export function ucFirst(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export interface DialogModel {
  [key: string]: any;
  view: string;
}

export function openDialog(viewModel: any, model: DialogModel) {
  const dialogService = Container.instance.get(DialogService);

  return dialogService.open({
    centerHorizontalOnly: true,
    model,
    view: "utils/generic-dialog.html",
    viewModel,
  });
}
