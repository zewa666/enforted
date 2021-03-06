import { DialogService } from "aurelia-dialog";
import { EventAggregator } from "aurelia-event-aggregator";
import { autoinject } from "aurelia-framework";
import {
  localStorageMiddleware,
  MiddlewarePlacement,
  rehydrateFromLocalStorage,
  Store
} from "aurelia-store";
import { skip, take } from "rxjs/operators";

import {
  collapsedMines,
  defiledAltar,
  forgottenEquipment,
  pausedResourceProduction,
  ragingFire,
  sacrificeResources,
  stumblingSteps
} from "./store/actions/tragedy-events";
import {
  buyBuilding,
  buyFortressBuilding,
  closePurchasePanel,
  destroyBuilding,
  LOCALSTORAGE_SAVE_KEY,
  openPurchaseForTile,
  reinforceTileBuilding,
  rollDice,
  State
} from "./store/index";

@autoinject()
export class App {
  public sidebarVisible: boolean = true;

  constructor(
    private store: Store<State>,
    private dialogService: DialogService,
    private ea: EventAggregator
  ) {
    this.store
      .state
      .pipe(
        skip(1),
        take(1)
      ).subscribe(() => {
        this.store.registerMiddleware(
          localStorageMiddleware,
          MiddlewarePlacement.After,
          { key: LOCALSTORAGE_SAVE_KEY }
        );
      });

    this.store.registerAction("Rehydrate from localstorage", rehydrateFromLocalStorage);
    this.store.registerAction("roll the dice", rollDice);
    this.store.registerAction("open the purchase panel", openPurchaseForTile);
    this.store.registerAction("close the purchase panel", closePurchasePanel);
    this.store.registerAction("buy a tile building", buyBuilding);
    this.store.registerAction("destroy a tile building", destroyBuilding);
    this.store.registerAction("[tragedy] sacrifice resources", sacrificeResources);
    this.store.registerAction("[tragedy] raging fire", ragingFire);
    this.store.registerAction("[tragedy] the forgotten equipment", forgottenEquipment);
    this.store.registerAction("[tragedy] a defiled altar", defiledAltar);
    this.store.registerAction("[tragedy] paused resource production", pausedResourceProduction);
    this.store.registerAction("[tragedy] collapsed mines", collapsedMines);
    this.store.registerAction("[tragedy] stumbling steps", stumblingSteps);
    this.store.registerAction("buy fortress building", buyFortressBuilding);
    this.store.registerAction("reinforce tile building", reinforceTileBuilding);

    this.store.dispatch(rehydrateFromLocalStorage, LOCALSTORAGE_SAVE_KEY);
  }

  public attached() {
    window.addEventListener("keyup", this.handleGlobalKeys);
  }

  public detached() {
    window.removeEventListener("keyup", this.handleGlobalKeys);
  }

  private handleGlobalKeys = (event: KeyboardEvent) => {
    if (!this.dialogService.hasOpenDialog && event.keyCode === 13) {
      this.ea.publish("key-shortcut", event.keyCode);
    }
  }
}
