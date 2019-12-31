var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('app',["require", "exports", "aurelia-dialog", "aurelia-framework", "aurelia-store", "rxjs/operators", "./store/actions/tragedy-events", "./store/index"], function (require, exports, aurelia_dialog_1, aurelia_framework_1, aurelia_store_1, operators_1, tragedy_events_1, index_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var App = (function () {
        function App(store, dialogService) {
            var _this = this;
            this.store = store;
            this.dialogService = dialogService;
            this.commandBarVisible = true;
            this.handleGlobalKeys = function (event) {
                if (!_this.dialogService.hasOpenDialog && event.keyCode === 13) {
                    _this.store.dispatch(index_1.rollDice);
                }
            };
            this.store
                .state
                .pipe(operators_1.skip(1), operators_1.take(1)).subscribe(function () {
                _this.store.registerMiddleware(aurelia_store_1.localStorageMiddleware, aurelia_store_1.MiddlewarePlacement.After, { key: index_1.LOCALSTORAGE_SAVE_KEY });
            });
            this.store.registerAction("Rehydrate from localstorage", aurelia_store_1.rehydrateFromLocalStorage);
            this.store.registerAction("roll the dice", index_1.rollDice);
            this.store.registerAction("open the purchase panel", index_1.openPurchaseForTile);
            this.store.registerAction("close the purchase panel", index_1.closePurchasePanel);
            this.store.registerAction("buy a tile building", index_1.buyBuilding);
            this.store.registerAction("[tragedy] sacrifice resources", tragedy_events_1.sacrificeResources);
            this.store.registerAction("[tragedy] raging fire", tragedy_events_1.ragingFire);
            this.store.registerAction("[tragedy] the forgotten equipment", tragedy_events_1.forgottenEquipment);
            this.store.registerAction("[tragedy] a defiled altar", tragedy_events_1.defiledAltar);
            this.store.registerAction("[tragedy] paused resource production", tragedy_events_1.pausedResourceProduction);
            this.store.registerAction("[tragey] collapsed mines", tragedy_events_1.collapsedMines);
            this.store.registerAction("[tragey] stumbling steps", tragedy_events_1.stumblingSteps);
            this.store.dispatch(aurelia_store_1.rehydrateFromLocalStorage, index_1.LOCALSTORAGE_SAVE_KEY);
        }
        App.prototype.attached = function () {
            window.addEventListener("keyup", this.handleGlobalKeys);
        };
        App.prototype.detached = function () {
            window.removeEventListener("keyup", this.handleGlobalKeys);
        };
        App = __decorate([
            aurelia_framework_1.autoinject(),
            __metadata("design:paramtypes", [aurelia_store_1.Store,
                aurelia_dialog_1.DialogService])
        ], App);
        return App;
    }());
    exports.App = App;
});
;
define('text!app.css',[],function(){return "/* stylelint-disable */\n/* General */\n/* Tiles */\n/* Fortress */\n/* Player */\n/* Commands */\n/* Purchase panel */\n/* Buildings */\n/* stylelint-enable */\n.body {\n  background-color: #292927;\n  margin: 0;\n  user-select: none; }\n\n.main {\n  display: flex;\n  height: 100vh;\n  margin: 0 auto;\n  width: 100vw; }\n  .main__command-bar {\n    flex-grow: 1; }\n  .main__board {\n    flex-grow: 22; }\n  .main__toggle-command-bar {\n    background-color: #0f0f0e;\n    border: none;\n    color: #928573; }\n    .main__toggle-command-bar::-moz-focus-inner {\n      border: 0; }\n    .main__toggle-command-bar:focus {\n      outline: none; }\n    @media (min-width: 1281px) {\n      .main__toggle-command-bar {\n        display: none; } }\n  @media (min-width: 1281px) {\n    .main {\n      height: 50vw;\n      margin: 10px auto;\n      width: 80vw; } }\n\nux-dialog-overlay.active {\n  background-color: #0f0f0e;\n  opacity: .5; }\n\n.tile {\n  align-items: center;\n  background-color: #0f0f0e;\n  background-repeat: no-repeat;\n  display: flex;\n  flex-grow: 1;\n  justify-content: center;\n  outline: 1px solid black;\n  position: relative; }\n  .tile--bottom {\n    background-position: bottom center;\n    background-size: 80%; }\n  .tile--top {\n    background-position: top center;\n    background-size: 80%; }\n  .tile--left {\n    background-position: left center; }\n  .tile--right {\n    background-position: right center; }\n  .tile--wood {\n    background-image: url(\"assets/icons/forest.svg\"); }\n  .tile--gold {\n    background-image: url(\"assets/icons/two-coins.svg\"); }\n  .tile--stone {\n    background-image: url(\"assets/icons/stone-block.svg\"); }\n  .tile--iron {\n    background-image: url(\"assets/icons/ore.svg\"); }\n  .tile--food {\n    background-image: url(\"assets/icons/wheat.svg\"); }\n  .tile--mana {\n    background-image: url(\"assets/icons/vortex.svg\"); }\n  .tile--coal {\n    background-image: url(\"assets/icons/brick-pile.svg\"); }\n  .tile--blood {\n    background-image: url(\"assets/icons/bloody-stash.svg\"); }\n  .tile--start {\n    background-image: url(\"assets/icons/direction-signs.svg\"); }\n  .tile--tragedy {\n    background-image: url(\"assets/icons/tear-tracks.svg\"); }\n  .tile--sacred_grounds {\n    background-image: url(\"assets/icons/tumulus.svg\"); }\n  .tile--corner {\n    background-size: initial;\n    flex-direction: column;\n    flex-grow: 2;\n    outline: 1px solid black;\n    position: relative; }\n  .tile__text {\n    font-size: 14px;\n    font-weight: 500;\n    left: 0;\n    line-height: 1vw;\n    position: absolute;\n    right: 0;\n    text-align: center;\n    top: 12%; }\n  .tile__player {\n    top: 30%; }\n\n.board {\n  height: 100%; }\n  .board__row {\n    display: flex;\n    width: 100%; }\n    .board__row--top, .board__row--bottom {\n      height: 15.384615385%; }\n    .board__row--bottom {\n      flex-flow: row-reverse; }\n    .board__row--center {\n      height: 69.23076923%; }\n  .board__col {\n    outline: 1px solid black;\n    position: relative; }\n    .board__col--left, .board__col--right {\n      display: flex;\n      flex-direction: column;\n      flex-grow: 2; }\n    .board__col--left {\n      flex-flow: column-reverse; }\n    .board__col--center {\n      flex-grow: 9; }\n  .board__fortress {\n    outline: none; }\n\n.fortress {\n  align-items: center;\n  background-color: lightgray;\n  display: flex;\n  height: 100%;\n  justify-content: center; }\n  .fortress__caption {\n    position: absolute; }\n\n.tragedy {\n  align-items: center;\n  display: flex;\n  flex-direction: column; }\n  .tragedy__image {\n    width: 150px; }\n  .tragedy__description {\n    text-align: justify;\n    text-justify: inter-word;\n    width: 400px; }\n\n.player {\n  align-items: center;\n  background-color: red;\n  border: 1px solid red;\n  border-radius: 50%;\n  display: flex;\n  font-size: 10px;\n  height: 4vw;\n  justify-content: center;\n  position: absolute;\n  width: 4vw;\n  z-index: 1; }\n\n.command__icon {\n  height: 40px;\n  width: 40px; }\n\n.command-bar {\n  display: flex;\n  flex-direction: column; }\n\n.dice {\n  align-items: center;\n  display: flex;\n  flex-direction: column;\n  justify-content: center; }\n  .dice__icon {\n    cursor: pointer; }\n  .dice__round {\n    margin: 5px 0; }\n  .dice__last-roll {\n    background-color: white;\n    font-size: 20px;\n    margin-top: 5px;\n    text-align: center;\n    width: 50px; }\n\n.resources-overview__list {\n  display: flex;\n  flex-direction: column;\n  list-style: none;\n  padding: 0;\n  width: 70px; }\n\n.resources-overview__item {\n  align-items: center;\n  display: flex;\n  justify-content: space-between; }\n\n.resources-overview__image {\n  width: 30px; }\n\n.save__actions {\n  display: flex;\n  flex-direction: column; }\n\n.tragedy-overview {\n  display: flex;\n  justify-content: center; }\n  .tragedy-overview__image {\n    width: 100px; }\n    .tragedy-overview__image--hidden {\n      visibility: hidden; }\n\n.purchase-panel__list {\n  list-style: none;\n  padding: 0; }\n\n.purchase-panel__building-icon {\n  width: 70px; }\n\n.purchase-panel__building-name {\n  display: flex;\n  justify-content: center; }\n\n.purchase-panel__buy {\n  margin-top: 10px; }\n\n.purchase-panel__cost {\n  list-style: none;\n  padding: 0 0 0 5px; }\n\n.purchase-panel__close {\n  margin-bottom: 15px; }\n\n.purchase-panel__header {\n  margin: 0; }\n\n.cost__item {\n  align-items: center;\n  display: flex;\n  justify-content: space-between; }\n\n.cost__icon {\n  width: 30px; }\n\n.tile-building {\n  display: flex;\n  height: 100%;\n  width: 100%; }\n  .tile-building--bottom {\n    justify-content: center; }\n  .tile-building--top {\n    align-items: flex-end;\n    justify-content: center; }\n  .tile-building--left {\n    align-items: center;\n    justify-content: flex-end; }\n  .tile-building--right {\n    align-items: center;\n    justify-content: flex-start; }\n  .tile-building__display {\n    background-repeat: no-repeat; }\n    .tile-building__display--sawmill {\n      background-image: url(\"assets/icons/crosscut-saw.svg\"); }\n    .tile-building__display--iron_mine {\n      background-image: url(\"assets/icons/mining.svg\"); }\n    .tile-building__display--farm {\n      background-image: url(\"assets/icons/windmill.svg\"); }\n    .tile-building__display--quarry {\n      background-image: url(\"assets/icons/stone-crafting.svg\"); }\n    .tile-building__display--gold_mine {\n      background-image: url(\"assets/icons/gold-mine.svg\"); }\n    .tile-building__display--mana_rift {\n      background-image: url(\"assets/icons/magic-portal.svg\"); }\n    .tile-building__display--coal_mine {\n      background-image: url(\"assets/icons/coal-wagon.svg\"); }\n    .tile-building__display--butchery {\n      background-image: url(\"assets/icons/meat-cleaver.svg\"); }\n    .tile-building__display--shrine {\n      background-image: url(\"assets/icons/fire-shrine.svg\"); }\n    .tile-building__display--bottom {\n      margin-top: 10%;\n      width: 45%; }\n    .tile-building__display--top {\n      height: 30%;\n      margin-bottom: 10%;\n      width: 45%; }\n    .tile-building__display--left {\n      height: 60%;\n      margin-right: 5%;\n      width: 27%; }\n    .tile-building__display--right {\n      height: 60%;\n      margin-left: 5%;\n      width: 27%; }\n\n/*# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXBwLmNzcyIsInNvdXJjZXMiOlsiYXBwLnNjc3MiLCIuLi9zdHlsZS9fY29sb3JzLnNjc3MiLCJib2FyZC9faW5kZXguc2NzcyIsImJvYXJkL190aWxlLnNjc3MiLCJib2FyZC9fYm9hcmQuc2NzcyIsImJvYXJkL190cmFnZWR5LnNjc3MiLCJwbGF5ZXIvX3BsYXllci5zY3NzIiwiY29tbWFuZHMvX2luZGV4LnNjc3MiLCJidWlsZGluZ3MvX2luZGV4LnNjc3MiLCJidWlsZGluZ3MvX3B1cmNoYXNlLXBhbmVsLnNjc3MiLCJidWlsZGluZ3MvX3RpbGUtYnVpbGRpbmcuc2NzcyJdLCJzb3VyY2VzQ29udGVudCI6WyJAaW1wb3J0IFwiLi4vc3R5bGUvY29sb3JzXCI7XG5cbi5ib2R5IHtcbiAgYmFja2dyb3VuZC1jb2xvcjogJGJvZHktYmc7XG4gIG1hcmdpbjogMDtcbiAgdXNlci1zZWxlY3Q6IG5vbmU7XG59XG5cbi5tYWluIHtcbiAgZGlzcGxheTogZmxleDtcbiAgaGVpZ2h0OiAxMDB2aDtcbiAgbWFyZ2luOiAwIGF1dG87XG4gIHdpZHRoOiAxMDB2dztcblxuICAmX19jb21tYW5kLWJhciB7XG4gICAgZmxleC1ncm93OiAxO1xuICB9XG5cbiAgJl9fYm9hcmQge1xuICAgIGZsZXgtZ3JvdzogMjI7XG4gIH1cblxuICAmX190b2dnbGUtY29tbWFuZC1iYXIge1xuICAgIGJhY2tncm91bmQtY29sb3I6ICR0b2dnbGUtY2Jhci1idG4tYmc7XG4gICAgYm9yZGVyOiBub25lO1xuICAgIGNvbG9yOiAkdG9nZ2xlLWNiYXItYnRuLWZnO1xuXG4gICAgJjo6LW1vei1mb2N1cy1pbm5lciB7IFxuICAgICAgYm9yZGVyOiAwO1xuICAgIH1cbiAgICAmOmZvY3VzIHsgb3V0bGluZTogbm9uZTsgfVxuXG4gICAgQG1lZGlhIChtaW4td2lkdGg6IDEyODFweCkgeyBcbiAgICAgIGRpc3BsYXk6IG5vbmU7XG4gICAgfVxuICB9XG5cbiAgQG1lZGlhIChtaW4td2lkdGg6IDEyODFweCkgeyBcbiAgICBoZWlnaHQ6IDUwdnc7XG4gICAgbWFyZ2luOiAxMHB4IGF1dG87XG4gICAgd2lkdGg6IDgwdnc7XG4gIH0gXG59XG5cbi8vIHN0eWxlbGludC1kaXNhYmxlLW5leHQtbGluZVxudXgtZGlhbG9nLW92ZXJsYXkuYWN0aXZlIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogJGRpYWxvZy1vdmVybGF5LWJnO1xuICBvcGFjaXR5OiAuNTtcbn1cblxuQGltcG9ydCBcIi4vYm9hcmQvaW5kZXhcIjtcbkBpbXBvcnQgXCIuL3BsYXllci9wbGF5ZXJcIjtcbkBpbXBvcnQgXCIuL2NvbW1hbmRzL2luZGV4XCI7XG5AaW1wb3J0IFwiLi9idWlsZGluZ3MvaW5kZXhcIjtcbiIsIi8qIHN0eWxlbGludC1kaXNhYmxlICovXG4kZ3JhcGhpdGU6ICMyQTI3MDg7XG4kc3RvbmV3YWxsOiAjOTI4NTczO1xuJGJlYXZlcjogIzg5NjU1MjtcbiRnb2xkOiAjRkZENzAwO1xuJGlyb246ICNENEQ3RDk7XG4kY2hhcmNvYWw6ICMzNjQ1NEY7XG4kYmxvb2Q6ICM4YTAzMDM7XG4kZWFzdGJheTogIzNDNDc3NztcbiRjb2QtZ3JheTogIzBmMGYwZTtcbiR0dWF0YXJhOiAjMjkyOTI3O1xuXG4vKiBHZW5lcmFsICovXG4kYm9keS1iZzogJHR1YXRhcmE7XG4kdG9nZ2xlLWNiYXItYnRuLWJnOiAkY29kLWdyYXk7XG4kdG9nZ2xlLWNiYXItYnRuLWZnOiAkc3RvbmV3YWxsO1xuJGRpYWxvZy1vdmVybGF5LWJnOiAkY29kLWdyYXk7XG5cbi8qIFRpbGVzICovXG4kdGlsZS1iZzogJGNvZC1ncmF5O1xuJHRpbGUtYm9yZGVyLWJnOiBibGFjaztcbiR0aWxlLWJnLS13b29kOiAkZ3JhcGhpdGU7XG4kdGlsZS1iZy0tc3RvbmU6ICRzdG9uZXdhbGw7XG4kdGlsZS1iZy0taXJvbjogJGlyb247XG4kdGlsZS1iZy0tZ29sZDogJGdvbGQ7XG4kdGlsZS1iZy0tZm9vZDogJGJlYXZlcjtcbiR0aWxlLWJnLS1tYW5hOiAkZWFzdGJheTtcbiR0aWxlLWJnLS1jb2FsOiAkY2hhcmNvYWw7XG4kdGlsZS1iZy0tYmxvb2Q6ICRibG9vZDtcbiR0aWxlLWJnLS1zdGFydDogd2hpdGU7XG5cblxuLyogRm9ydHJlc3MgKi9cbiRmb3J0cmVzcy1iZzogbGlnaHRncmF5O1xuXG4vKiBQbGF5ZXIgKi9cbiRwbGF5ZXItYmctYm9yZGVyOiByZWQ7XG5cbi8qIENvbW1hbmRzICovXG4kZGljZS10ZXh0LWJnOiB3aGl0ZTtcblxuLyogUHVyY2hhc2UgcGFuZWwgKi9cbiRwdXJjaGFzZS1wYW5lbC1iZzogYmxhY2s7XG5cbi8qIEJ1aWxkaW5ncyAqL1xuJGJ1aWxkaW5nLXJhZGlhbC1iZzogJHR1YXRhcmE7XG4kYnVpbGRpbmctaW5kaWNhdG9yLWJnOiBibGFjaztcbi8qIHN0eWxlbGludC1lbmFibGUgKi9cbiIsIkBpbXBvcnQgXCIuL3RpbGVcIjtcbkBpbXBvcnQgXCIuL2JvYXJkXCI7XG5AaW1wb3J0IFwiLi90cmFnZWR5XCI7XG4iLCIudGlsZSB7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGJhY2tncm91bmQtY29sb3I6ICR0aWxlLWJnO1xuICBiYWNrZ3JvdW5kLXJlcGVhdDogbm8tcmVwZWF0O1xuICBkaXNwbGF5OiBmbGV4O1xuXHRmbGV4LWdyb3c6IDE7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBvdXRsaW5lOiAxcHggc29saWQgJHRpbGUtYm9yZGVyLWJnO1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG5cbiAgJi0tYm90dG9tIHtcbiAgICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiBib3R0b20gY2VudGVyO1xuICAgIGJhY2tncm91bmQtc2l6ZTogODAlO1xuICB9XG5cbiAgJi0tdG9wIHtcbiAgICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiB0b3AgY2VudGVyO1xuICAgIGJhY2tncm91bmQtc2l6ZTogODAlO1xuICB9XG5cbiAgJi0tbGVmdCB7XG4gICAgYmFja2dyb3VuZC1wb3NpdGlvbjogbGVmdCBjZW50ZXI7XG4gIH1cblxuICAmLS1yaWdodCB7XG4gICAgYmFja2dyb3VuZC1wb3NpdGlvbjogcmlnaHQgY2VudGVyO1xuICB9XG5cbiAgJi0td29vZCB7XG4gICAgYmFja2dyb3VuZC1pbWFnZTogdXJsKFwiYXNzZXRzL2ljb25zL2ZvcmVzdC5zdmdcIik7XG4gIH1cblxuICAmLS1nb2xkIHtcbiAgICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoXCJhc3NldHMvaWNvbnMvdHdvLWNvaW5zLnN2Z1wiKTtcbiAgfVxuXG4gICYtLXN0b25lIHtcbiAgICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoXCJhc3NldHMvaWNvbnMvc3RvbmUtYmxvY2suc3ZnXCIpO1xuICB9XG5cbiAgJi0taXJvbiB7XG4gICAgYmFja2dyb3VuZC1pbWFnZTogdXJsKFwiYXNzZXRzL2ljb25zL29yZS5zdmdcIik7XG4gIH1cblxuICAmLS1mb29kIHtcbiAgICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoXCJhc3NldHMvaWNvbnMvd2hlYXQuc3ZnXCIpO1xuXG4gIH1cblxuICAmLS1tYW5hIHtcbiAgICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoXCJhc3NldHMvaWNvbnMvdm9ydGV4LnN2Z1wiKTtcbiAgfVxuXG4gICYtLWNvYWwge1xuICAgIGJhY2tncm91bmQtaW1hZ2U6IHVybChcImFzc2V0cy9pY29ucy9icmljay1waWxlLnN2Z1wiKTtcbiAgfVxuXG4gICYtLWJsb29kIHtcbiAgICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoXCJhc3NldHMvaWNvbnMvYmxvb2R5LXN0YXNoLnN2Z1wiKTtcbiAgfVxuXG4gICYtLXN0YXJ0IHtcbiAgICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoXCJhc3NldHMvaWNvbnMvZGlyZWN0aW9uLXNpZ25zLnN2Z1wiKTtcbiAgfVxuXG4gICYtLXRyYWdlZHkge1xuICAgIGJhY2tncm91bmQtaW1hZ2U6IHVybChcImFzc2V0cy9pY29ucy90ZWFyLXRyYWNrcy5zdmdcIik7XG4gIH1cblxuICAmLS1zYWNyZWRfZ3JvdW5kcyB7XG4gICAgYmFja2dyb3VuZC1pbWFnZTogdXJsKFwiYXNzZXRzL2ljb25zL3R1bXVsdXMuc3ZnXCIpO1xuICB9XG5cbiAgJi0tY29ybmVyIHtcbiAgICBiYWNrZ3JvdW5kLXNpemU6IGluaXRpYWw7XG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICBmbGV4LWdyb3c6IDI7XG4gICAgb3V0bGluZTogMXB4IHNvbGlkICR0aWxlLWJvcmRlci1iZztcbiAgICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIH1cblxuICAmX190ZXh0IHtcbiAgICBmb250LXNpemU6IDE0cHg7XG4gICAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgICBsZWZ0OiAwO1xuICAgIGxpbmUtaGVpZ2h0OiAxdnc7XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgIHJpZ2h0OiAwO1xuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICB0b3A6IDEyJTtcbiAgfVxuXG4gICZfX3BsYXllciB7XG4gICAgdG9wOiAzMCU7XG4gIH1cbn1cbiIsIi5ib2FyZCB7XG4gIGhlaWdodDogMTAwJTtcblxuICAmX19yb3cge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgd2lkdGg6IDEwMCU7XG4gICAgXG4gICAgJi0tdG9wLFxuICAgICYtLWJvdHRvbSB7XG4gICAgICBoZWlnaHQ6IDE1LjM4NDYxNTM4NSU7XG4gICAgfVxuXG4gICAgJi0tYm90dG9tIHtcbiAgICAgIGZsZXgtZmxvdzogcm93LXJldmVyc2U7XG4gICAgfVxuXG4gICAgJi0tY2VudGVyIHsgICAgXG4gICAgICBoZWlnaHQ6IDY5LjIzMDc2OTIzJTtcbiAgICB9XG4gIH1cblxuICAmX19jb2wge1xuICAgIG91dGxpbmU6IDFweCBzb2xpZCAkdGlsZS1ib3JkZXItYmc7XG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xuXG4gICAgJi0tbGVmdCxcbiAgICAmLS1yaWdodCB7XG4gICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgIGZsZXgtZ3JvdzogMjtcbiAgICB9XG5cbiAgICAmLS1sZWZ0IHtcbiAgICAgIGZsZXgtZmxvdzogY29sdW1uLXJldmVyc2U7XG4gICAgfVxuXG4gICAgJi0tY2VudGVyIHtcbiAgICAgIGZsZXgtZ3JvdzogOTtcbiAgICB9XG4gIH1cblxuICAmX19mb3J0cmVzcyB7XG4gICAgb3V0bGluZTogbm9uZTtcbiAgfVxufVxuXG4uZm9ydHJlc3Mge1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiAkZm9ydHJlc3MtYmc7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGhlaWdodDogMTAwJTtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIFxuXG4gICZfX2NhcHRpb24ge1xuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgfVxufVxuIiwiLnRyYWdlZHkge1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuXG4gICZfX2ltYWdlIHtcbiAgICB3aWR0aDogMTUwcHg7XG4gIH1cblxuICAmX19kZXNjcmlwdGlvbiB7XG4gICAgdGV4dC1hbGlnbjoganVzdGlmeTtcbiAgICB0ZXh0LWp1c3RpZnk6IGludGVyLXdvcmQ7XG4gICAgd2lkdGg6IDQwMHB4O1xuICB9XG59XG4iLCIucGxheWVyIHtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgYmFja2dyb3VuZC1jb2xvcjogJHBsYXllci1iZy1ib3JkZXI7XG4gIGJvcmRlcjogMXB4IHNvbGlkICRwbGF5ZXItYmctYm9yZGVyO1xuICBib3JkZXItcmFkaXVzOiA1MCU7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZvbnQtc2l6ZTogMTBweDtcbiAgaGVpZ2h0OiA0dnc7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHdpZHRoOiA0dnc7XG4gIHotaW5kZXg6IDE7XG59XG4iLCIuY29tbWFuZCB7XG4gICZfX2ljb24ge1xuICAgIGhlaWdodDogNDBweDtcbiAgICB3aWR0aDogNDBweDtcbiAgfVxufVxuXG4uY29tbWFuZC1iYXIge1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xufVxuXG4uZGljZSB7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBcbiAgJl9faWNvbiB7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICB9XG5cbiAgJl9fcm91bmQge1xuICAgIG1hcmdpbjogNXB4IDA7XG4gIH1cbiAgXG4gICZfX2xhc3Qtcm9sbCB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogJGRpY2UtdGV4dC1iZztcbiAgICBmb250LXNpemU6IDIwcHg7XG4gICAgbWFyZ2luLXRvcDogNXB4O1xuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICB3aWR0aDogNTBweDtcbiAgfVxufVxuXG4ucmVzb3VyY2VzLW92ZXJ2aWV3IHtcbiAgJl9fbGlzdCB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgIGxpc3Qtc3R5bGU6IG5vbmU7XG4gICAgcGFkZGluZzogMDtcbiAgICB3aWR0aDogNzBweDtcbiAgfVxuICBcbiAgJl9faXRlbSB7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcbiAgfVxuXG4gICZfX2ltYWdlIHtcbiAgICB3aWR0aDogMzBweDtcbiAgfVxufVxuXG4uc2F2ZSB7XG4gICZfX2FjdGlvbnMge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgfVxufVxuXG4udHJhZ2VkeS1vdmVydmlldyB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuXG4gICZfX2ltYWdlIHtcbiAgICB3aWR0aDogMTAwcHg7XG5cbiAgICAmLS1oaWRkZW4ge1xuICAgICAgdmlzaWJpbGl0eTogaGlkZGVuO1xuICAgIH1cbiAgfVxufVxuIiwiQGltcG9ydCBcIi4vcHVyY2hhc2UtcGFuZWxcIjtcbkBpbXBvcnQgXCIuL3RpbGUtYnVpbGRpbmdcIjtcbiIsIi5wdXJjaGFzZS1wYW5lbCB7XG4gICZfX2xpc3Qge1xuICAgIGxpc3Qtc3R5bGU6IG5vbmU7XG4gICAgcGFkZGluZzogMDtcbiAgfVxuXG4gICZfX2J1aWxkaW5nLWljb24ge1xuICAgIHdpZHRoOiA3MHB4O1xuICB9XG5cbiAgJl9fYnVpbGRpbmctbmFtZSB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgfVxuXG4gICZfX2J1eSB7XG4gICAgbWFyZ2luLXRvcDogMTBweDtcbiAgfVxuXG4gICZfX2Nvc3Qge1xuICAgIGxpc3Qtc3R5bGU6IG5vbmU7XG4gICAgcGFkZGluZzogMCAwIDAgNXB4O1xuICB9XG5cbiAgJl9fY2xvc2Uge1xuICAgIG1hcmdpbi1ib3R0b206IDE1cHg7XG4gIH1cblxuICAmX19oZWFkZXIge1xuICAgIG1hcmdpbjogMDtcbiAgfVxufVxuXG4uY29zdCB7XG4gICZfX2l0ZW0ge1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gIH1cblxuICAmX19pY29uIHtcbiAgICB3aWR0aDogMzBweDtcbiAgfVxufVxuIiwiLnRpbGUtYnVpbGRpbmcge1xuICBkaXNwbGF5OiBmbGV4O1xuICBoZWlnaHQ6IDEwMCU7XG4gIHdpZHRoOiAxMDAlO1xuXG4gICYtLWJvdHRvbSB7XG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIH1cblxuICAmLS10b3Age1xuICAgIGFsaWduLWl0ZW1zOiBmbGV4LWVuZDtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgfVxuXG4gICYtLWxlZnQge1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAganVzdGlmeS1jb250ZW50OiBmbGV4LWVuZDtcbiAgfVxuXG4gICYtLXJpZ2h0IHtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGp1c3RpZnktY29udGVudDogZmxleC1zdGFydDtcbiAgfVxuXG4gICZfX2Rpc3BsYXkge1xuICAgIGJhY2tncm91bmQtcmVwZWF0OiBuby1yZXBlYXQ7XG4gICAgXG4gICAgJi0tc2F3bWlsbCB7XG4gICAgICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoXCJhc3NldHMvaWNvbnMvY3Jvc3NjdXQtc2F3LnN2Z1wiKTtcbiAgICB9XG5cbiAgICAmLS1pcm9uX21pbmUge1xuICAgICAgYmFja2dyb3VuZC1pbWFnZTogdXJsKFwiYXNzZXRzL2ljb25zL21pbmluZy5zdmdcIik7XG4gICAgfVxuXG4gICAgJi0tZmFybSB7XG4gICAgICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoXCJhc3NldHMvaWNvbnMvd2luZG1pbGwuc3ZnXCIpO1xuICAgIH1cblxuICAgICYtLXF1YXJyeSB7XG4gICAgICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoXCJhc3NldHMvaWNvbnMvc3RvbmUtY3JhZnRpbmcuc3ZnXCIpO1xuICAgIH1cblxuICAgICYtLWdvbGRfbWluZSB7XG4gICAgICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoXCJhc3NldHMvaWNvbnMvZ29sZC1taW5lLnN2Z1wiKTtcbiAgICB9XG5cbiAgICAmLS1tYW5hX3JpZnQge1xuICAgICAgYmFja2dyb3VuZC1pbWFnZTogdXJsKFwiYXNzZXRzL2ljb25zL21hZ2ljLXBvcnRhbC5zdmdcIik7XG4gICAgfVxuXG4gICAgJi0tY29hbF9taW5lIHtcbiAgICAgIGJhY2tncm91bmQtaW1hZ2U6IHVybChcImFzc2V0cy9pY29ucy9jb2FsLXdhZ29uLnN2Z1wiKTtcbiAgICB9XG5cbiAgICAmLS1idXRjaGVyeSB7XG4gICAgICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoXCJhc3NldHMvaWNvbnMvbWVhdC1jbGVhdmVyLnN2Z1wiKTtcbiAgICB9XG5cbiAgICAmLS1zaHJpbmUge1xuICAgICAgYmFja2dyb3VuZC1pbWFnZTogdXJsKFwiYXNzZXRzL2ljb25zL2ZpcmUtc2hyaW5lLnN2Z1wiKTtcbiAgICB9XG5cbiAgICAmLS1ib3R0b20ge1xuICAgICAgbWFyZ2luLXRvcDogMTAlO1xuICAgICAgd2lkdGg6IDQ1JTtcbiAgICB9XG5cbiAgICAmLS10b3Age1xuICAgICAgaGVpZ2h0OiAzMCU7XG4gICAgICBtYXJnaW4tYm90dG9tOiAxMCU7XG4gICAgICB3aWR0aDogNDUlO1xuICAgIH1cblxuICAgICYtLWxlZnQge1xuICAgICAgaGVpZ2h0OiA2MCU7XG4gICAgICBtYXJnaW4tcmlnaHQ6IDUlO1xuICAgICAgd2lkdGg6IDI3JTtcbiAgICB9XG5cbiAgICAmLS1yaWdodCB7XG4gICAgICBoZWlnaHQ6IDYwJTtcbiAgICAgIG1hcmdpbi1sZWZ0OiA1JTtcbiAgICAgIHdpZHRoOiAyNyU7XG4gICAgfVxuICB9XG59XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFDQUEsdUJBQXVCO0FBWXZCLGFBQWE7QUFNYixXQUFXO0FBY1gsY0FBYztBQUdkLFlBQVk7QUFHWixjQUFjO0FBR2Qsb0JBQW9CO0FBR3BCLGVBQWU7QUFHZixzQkFBc0I7QUQ3Q3RCLEFBQUEsS0FBSyxDQUFDO0VBQ0osZ0JBQWdCLEVDT1IsT0FBTztFRE5mLE1BQU0sRUFBRSxDQUFDO0VBQ1QsV0FBVyxFQUFFLElBQUksR0FDbEI7O0FBRUQsQUFBQSxLQUFLLENBQUM7RUFDSixPQUFPLEVBQUUsSUFBSTtFQUNiLE1BQU0sRUFBRSxLQUFLO0VBQ2IsTUFBTSxFQUFFLE1BQU07RUFDZCxLQUFLLEVBQUUsS0FBSyxHQThCYjtFQTVCRSxBQUFELGtCQUFjLENBQUM7SUFDYixTQUFTLEVBQUUsQ0FBQyxHQUNiO0VBRUEsQUFBRCxZQUFRLENBQUM7SUFDUCxTQUFT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 */\n";});;
define('text!app.html',[],function(){return "<template>\n  <require from=\"./app.css\"></require>\n  <div class=\"main\">\n    <button class=\"main__toggle-command-bar\"\n            click.trigger=\"commandBarVisible = !commandBarVisible\">${!commandBarVisible ? \"⇶\" : \"⬱\"}</button>\n    <command-bar class=\"main__command-bar\"\n                 show.bind=\"commandBarVisible\"></command-bar>\n    <board class=\"main__board\"></board>\n  </div>\n</template>\n";});;
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('board/board',["require", "exports", "aurelia-framework", "aurelia-store"], function (require, exports, aurelia_framework_1, aurelia_store_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Board = (function () {
        function Board(store) {
            var _this = this;
            this.store = store;
            this.subscription = this.store.state.subscribe(function (state) { return _this.state = state; });
        }
        Board.prototype.getTiles = function (ring, placement) {
            var _a, _b;
            return (_b = (_a = this.state) === null || _a === void 0 ? void 0 : _a.tiles) === null || _b === void 0 ? void 0 : _b.filter(function (t) { return t.placement === placement && t.ring === ring; });
        };
        Board.prototype.detached = function () {
            this.subscription.unsubscribe();
        };
        Board = __decorate([
            aurelia_framework_1.autoinject(),
            __metadata("design:paramtypes", [aurelia_store_1.Store])
        ], Board);
        return Board;
    }());
    exports.Board = Board;
});
;
define('text!board/board.html',[],function(){return "<template class=\"board\">\n  <div class=\"board__row board__row--top\">\n    <tile repeat.for=\"tile of getTiles('outer', 'top')\"\n          class=\"tile--top\"\n          type.bind=\"tile.type\"\n          is-corner.bind=\"tile.isCorner\"\n          ring.bind=\"tile.ring\"\n          id.bind=\"tile.id\"\n          placement.bind=\"tile.placement\"\n          players.bind=\"state.players\"\n          resources.bind=\"state.resources\"\n          tile-buildings.bind=\"state.tileBuildings\"></tile>\n  </div>\n  <div class=\"board__row board__row--center\">\n    <div class=\"${bem('board', 'col', 'left')}\">\n      <tile repeat.for=\"tile of getTiles('outer', 'left')\"\n            class=\"tile--left\"\n            type.bind=\"tile.type\"\n            is-corner.bind=\"tile.isCorner\"\n            ring.bind=\"tile.ring\"\n            id.bind=\"tile.id\"\n            placement.bind=\"tile.placement\"\n            players.bind=\"state.players\"\n            resources.bind=\"state.resources\"\n            tile-buildings.bind=\"state.tileBuildings\"></tile>\n    </div>\n    <div class=\"${bem('board', 'col', 'center')}\">\n\n      <!-- Inner circle -->\n      <div class=\"board__row board__row--top\">\n        <tile repeat.for=\"tile of getTiles('inner', 'top')\"\n              class=\"tile--top\"\n              type.bind=\"tile.type\"\n              is-corner.bind=\"tile.isCorner\"\n              ring.bind=\"tile.ring\"\n              id.bind=\"tile.id\"\n              placement.bind=\"tile.placement\"\n              players.bind=\"state.players\"\n              resources.bind=\"state.resources\"\n              tile-buildings.bind=\"state.tileBuildings\"></tile>\n      </div>\n      <div class=\"board__row board__row--center\">\n        <div class=\"${bem('board', 'col', 'left')}\">\n          <tile repeat.for=\"tile of getTiles('inner', 'left')\"\n                class=\"tile--left\"\n                type.bind=\"tile.type\"\n                is-corner.bind=\"tile.isCorner\"\n                ring.bind=\"tile.ring\"\n                id.bind=\"tile.id\"\n                placement.bind=\"tile.placement\"\n                players.bind=\"state.players\"\n                resources.bind=\"state.resources\"\n                tile-buildings.bind=\"state.tileBuildings\"></tile>\n        </div>\n        <div class=\"${bem('board', 'col', 'center')}\">\n\n          <!-- Fortress -->\n          <div class=\"board__fortress fortress\">\n            <span class=\"fortress__caption\">Fortress</span>\n          </div>\n          <!-- /Fortress -->\n\n        </div>\n        <div class=\"${bem('board', 'col', 'right')}\">\n          <tile repeat.for=\"tile of getTiles('inner', 'right')\"\n                class=\"tile--right\"\n                type.bind=\"tile.type\"\n                is-corner.bind=\"tile.isCorner\"\n                ring.bind=\"tile.ring\"\n                id.bind=\"tile.id\"\n                placement.bind=\"tile.placement\"\n                players.bind=\"state.players\"\n                resources.bind=\"state.resources\"\n                tile-buildings.bind=\"state.tileBuildings\"></tile>\n        </div>\n      </div>\n      <div class=\"board__row board__row--bottom\">\n        <tile repeat.for=\"tile of getTiles('inner', 'bottom')\"\n              class=\"tile--bottom\"\n              type.bind=\"tile.type\"\n              is-corner.bind=\"tile.isCorner\"\n              ring.bind=\"tile.ring\"\n              id.bind=\"tile.id\"\n              placement.bind=\"tile.placement\"\n              players.bind=\"state.players\"\n              resources.bind=\"state.resources\"\n              tile-buildings.bind=\"state.tileBuildings\"></tile>\n      </div>\n      <!-- /Inner circle -->\n\n    </div>\n    <div class=\"${bem('board', 'col', 'right')}\">\n      <tile repeat.for=\"tile of getTiles('outer', 'right')\"\n            class=\"tile--right\"\n            type.bind=\"tile.type\"\n            is-corner.bind=\"tile.isCorner\"\n            ring.bind=\"tile.ring\"\n            id.bind=\"tile.id\"\n            placement.bind=\"tile.placement\"\n            players.bind=\"state.players\"\n            resources.bind=\"state.resources\"\n            tile-buildings.bind=\"state.tileBuildings\"></tile>\n    </div>\n  </div>\n  <div class=\"board__row board__row--bottom\">\n    <tile repeat.for=\"tile of getTiles('outer', 'bottom')\"\n          class=\"tile--bottom\"\n          type.bind=\"tile.type\"\n          is-corner.bind=\"tile.isCorner\"\n          ring.bind=\"tile.ring\"\n          id.bind=\"tile.id\"\n          placement.bind=\"tile.placement\"\n          players.bind=\"state.players\"\n          resources.bind=\"state.resources\"\n          tile-buildings.bind=\"state.tileBuildings\"></tile>\n  </div>\n</template>\n";});;
define('board/index',["require", "exports", "./board", "./tile", "./tragedy"], function (require, exports, board_1, tile_1, tragedy_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function configure(config) {
        config.globalResources([
            tile_1.Tile,
            board_1.Board,
            tragedy_1.Tragedy
        ]);
    }
    exports.configure = configure;
});
;
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define('board/tile',["require", "exports", "aurelia-framework", "aurelia-store", "../buildings/purchase-panel", "../store/index", "../utils/utils", "./tragedy"], function (require, exports, aurelia_framework_1, aurelia_store_1, purchase_panel_1, index_1, utils_1, tragedy_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Tile = (function () {
        function Tile(store) {
            this.store = store;
            this.isCorner = false;
            this.players = [];
            this.tileBuildings = [];
        }
        Tile.prototype.playersChanged = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(this.type === "tragedy" && this.isPlayerOnTile)) return [3, 2];
                            return [4, utils_1.openDialog(tragedy_1.Tragedy, {
                                    view: "board/tragedy.html"
                                }, true)];
                        case 1:
                            _a.sent();
                            _a.label = 2;
                        case 2: return [2];
                    }
                });
            });
        };
        Object.defineProperty(Tile.prototype, "isPlayerOnTile", {
            get: function () {
                var _this = this;
                var _a;
                return ((_a = this.players) === null || _a === void 0 ? void 0 : _a.filter(function (p) { return p.currentTileId === _this.id; }).length) > 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Tile.prototype, "isBuildingOnTile", {
            get: function () {
                var _this = this;
                var _a;
                return ((_a = this.tileBuildings) === null || _a === void 0 ? void 0 : _a.filter(function (b) { return b.tileId === _this.id; }).length) > 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Tile.prototype, "tileBuilding", {
            get: function () {
                var _this = this;
                var _a;
                return (_a = this.tileBuildings) === null || _a === void 0 ? void 0 : _a.find(function (b) { return b.tileId === _this.id; });
            },
            enumerable: true,
            configurable: true
        });
        Tile.prototype.openPurchasePanel = function () {
            var _a;
            return __awaiter(this, void 0, void 0, function () {
                var _this = this;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            if (!(this.type !== "start" && this.type !== "tragedy" && this.isPlayerOnTile)) return [3, 2];
                            return [4, this.store.dispatch(index_1.openPurchaseForTile, this)];
                        case 1:
                            _b.sent();
                            utils_1.openDialog(purchase_panel_1.PurchasePanel, {
                                resources: this.resources,
                                tile: this,
                                tileBuilding: (_a = this.tileBuildings) === null || _a === void 0 ? void 0 : _a.find(function (b) { return b.tileId === _this.id; }),
                                view: "buildings/purchase-panel.html",
                            });
                            _b.label = 2;
                        case 2: return [2];
                    }
                });
            });
        };
        __decorate([
            aurelia_framework_1.bindable,
            __metadata("design:type", String)
        ], Tile.prototype, "type", void 0);
        __decorate([
            aurelia_framework_1.bindable,
            __metadata("design:type", String)
        ], Tile.prototype, "placement", void 0);
        __decorate([
            aurelia_framework_1.bindable,
            __metadata("design:type", Boolean)
        ], Tile.prototype, "isCorner", void 0);
        __decorate([
            aurelia_framework_1.bindable,
            __metadata("design:type", String)
        ], Tile.prototype, "ring", void 0);
        __decorate([
            aurelia_framework_1.bindable,
            __metadata("design:type", Array)
        ], Tile.prototype, "players", void 0);
        __decorate([
            aurelia_framework_1.bindable,
            __metadata("design:type", Array)
        ], Tile.prototype, "tileBuildings", void 0);
        __decorate([
            aurelia_framework_1.bindable,
            __metadata("design:type", String)
        ], Tile.prototype, "id", void 0);
        __decorate([
            aurelia_framework_1.bindable,
            __metadata("design:type", Object)
        ], Tile.prototype, "resources", void 0);
        __decorate([
            aurelia_framework_1.computedFrom("players"),
            __metadata("design:type", Object),
            __metadata("design:paramtypes", [])
        ], Tile.prototype, "isPlayerOnTile", null);
        __decorate([
            aurelia_framework_1.computedFrom("tileBuildings"),
            __metadata("design:type", Object),
            __metadata("design:paramtypes", [])
        ], Tile.prototype, "isBuildingOnTile", null);
        Tile = __decorate([
            aurelia_framework_1.autoinject(),
            __metadata("design:paramtypes", [aurelia_store_1.Store])
        ], Tile);
        return Tile;
    }());
    exports.Tile = Tile;
});
;
define('text!board/tile.html',[],function(){return "<template title.bind=\"type\"\n          dblclick.delegate=\"openPurchasePanel()\"\n          class=\"${bem('tile', '', [type, isCorner && 'corner'])}\">\n  <player repeat.for=\"player of players\"\n          if.bind=\"isPlayerOnTile\"\n          class=\"tile__player\"\n          name.bind=\"player.name\"\n          current-tile-id.bind=\"$parent.id\"></player>\n\n  <tile-building if.bind=\"isBuildingOnTile\"\n                 tile-id.bind=\"id\"\n                 type.bind=\"tileBuilding.type\"\n                 placement.bind=\"placement\"></tile-building>\n</template>\n";});;
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('board/tragedy',["require", "exports", "aurelia-dialog", "aurelia-framework", "aurelia-store", "rxjs/operators", "../store/actions/tragedy-events", "../store/helper"], function (require, exports, aurelia_dialog_1, aurelia_framework_1, aurelia_store_1, operators_1, tragedy_events_1, helper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Tragedy = (function () {
        function Tragedy(store, controller) {
            this.store = store;
            this.controller = controller;
        }
        Tragedy.prototype.activate = function (model) {
            var _this = this;
            this.dialogView = model.view;
            this.bemclasses = model.bem;
            this.store.state.pipe(operators_1.take(1)).subscribe(function (state) {
                _this.state = state;
                if (_this.state.activeTragedy !== undefined) {
                    _this.event = {
                        effect: function () { return "You beared more tragedy than a poor soul can handle"; },
                        event: -1,
                        image: "prayer",
                        name: "No more tragedy",
                        weight: 0,
                    };
                }
                else {
                    _this.drawRandomTragedyEvent();
                }
            });
        };
        Tragedy.prototype.drawRandomTragedyEvent = function () {
            var sum = 0;
            var r = Math.random();
            var probability = exports.tragedyEvents.reduce(function (acc, curr, idx) {
                acc[idx] = curr.weight;
                return acc;
            }, {});
            for (var i in probability) {
                if (probability.hasOwnProperty(i)) {
                    sum += probability[i];
                    if (r <= sum) {
                        this.event = exports.tragedyEvents[parseInt(i.toString(), 10)];
                        break;
                    }
                }
            }
        };
        Tragedy = __decorate([
            aurelia_framework_1.autoinject(),
            __metadata("design:paramtypes", [aurelia_store_1.Store,
                aurelia_dialog_1.DialogController])
        ], Tragedy);
        return Tragedy;
    }());
    exports.Tragedy = Tragedy;
    var AvailableTragedyEvents;
    (function (AvailableTragedyEvents) {
        AvailableTragedyEvents[AvailableTragedyEvents["Sacrifice"] = 0] = "Sacrifice";
        AvailableTragedyEvents[AvailableTragedyEvents["RagingFire"] = 1] = "RagingFire";
        AvailableTragedyEvents[AvailableTragedyEvents["StumblingSteps"] = 2] = "StumblingSteps";
        AvailableTragedyEvents[AvailableTragedyEvents["ForgottenEquipment"] = 3] = "ForgottenEquipment";
        AvailableTragedyEvents[AvailableTragedyEvents["DefiledAltar"] = 4] = "DefiledAltar";
        AvailableTragedyEvents[AvailableTragedyEvents["CollapsedMines"] = 5] = "CollapsedMines";
        AvailableTragedyEvents[AvailableTragedyEvents["Vermins"] = 6] = "Vermins";
        AvailableTragedyEvents[AvailableTragedyEvents["Rockfall"] = 7] = "Rockfall";
        AvailableTragedyEvents[AvailableTragedyEvents["ShatteringEarth"] = 8] = "ShatteringEarth";
        AvailableTragedyEvents[AvailableTragedyEvents["BurningTrees"] = 9] = "BurningTrees";
        AvailableTragedyEvents[AvailableTragedyEvents["ContaminatedBlood"] = 10] = "ContaminatedBlood";
    })(AvailableTragedyEvents = exports.AvailableTragedyEvents || (exports.AvailableTragedyEvents = {}));
    exports.tragedyEvents = [
        {
            effect: function (store, state) {
                var amount = helper_1.randBetween(1, 4);
                var availableResources = Object.keys(state.resources)
                    .filter(function (r) { return state.resources[r] > 0; });
                var resourceType = availableResources[helper_1.randBetween(0, availableResources.length - 1)];
                var description = "In order to please the gods you sacrifice " + amount + " of your " + resourceType + ".";
                store.dispatch(tragedy_events_1.sacrificeResources, resourceType, amount);
                return description;
            },
            event: AvailableTragedyEvents.Sacrifice,
            image: "sacrificial-dagger",
            name: "A sacrifice for the gods",
            weight: 0.08
        },
        {
            effect: function (store, state) {
                if (state.tileBuildings.length === 0) {
                    return "A building burned to the ground, but luckily it was none of yours.";
                }
                var targetBuilding = state.tileBuildings[helper_1.randBetween(0, state.tileBuildings.length - 1)];
                var description = "A fire broke out! Your " + targetBuilding.type + " burned to the ground.";
                store.dispatch(tragedy_events_1.ragingFire, targetBuilding.tileId);
                return description;
            },
            event: AvailableTragedyEvents.RagingFire,
            image: "small-fire",
            name: "Raging fire",
            weight: 0.07
        },
        {
            effect: function (store) {
                store.dispatch(tragedy_events_1.stumblingSteps);
                return "Your last nights tavern demands it's toll. Your next dice rolls are wonky small steps.";
            },
            event: AvailableTragedyEvents.StumblingSteps,
            image: "beer-stein",
            name: "Stumbling steps",
            weight: 0.12
        },
        {
            effect: function (store) {
                store.dispatch(tragedy_events_1.forgottenEquipment);
                return "You were in such a hurry rushing for the adventure leaving your essentials at the door steps. Go back to the start of your journey and get them.";
            },
            event: AvailableTragedyEvents.ForgottenEquipment,
            image: "bindle",
            name: "The forgotten equipment",
            weight: 0.11
        },
        {
            effect: function (store, state) {
                var shrines = state.tileBuildings.filter(function (tb) { return tb.type === "shrine"; });
                if (shrines.length === 0) {
                    return "A shrine has been defiled, yet it was one for the wrong gods.";
                }
                store.dispatch(tragedy_events_1.defiledAltar);
                return "Strangers have been seen, defiling one of your shrines. 'Tis your duty to rebuild them in full glory.";
            },
            event: AvailableTragedyEvents.DefiledAltar,
            image: "broken-tablet",
            name: "Defiled altar",
            weight: 0.07
        },
        {
            effect: function (store) {
                var mineTypes = [
                    "gold_mine", "iron_mine", "coal_mine"
                ];
                var mineType = mineTypes[helper_1.randBetween(0, mineTypes.length)];
                var description = "Men screamed and shouted, sealed in the dark groves of your " + mineType + ". Poor devils souls, for their life found it's end in the dark.";
                store.dispatch(tragedy_events_1.collapsedMines, mineType);
                return description;
            },
            event: AvailableTragedyEvents.CollapsedMines,
            image: "oppression",
            name: "Collapsed mines",
            weight: 0.10
        },
        {
            effect: function (store) {
                store.dispatch(tragedy_events_1.pausedResourceProduction, AvailableTragedyEvents.Vermins);
                return "Your mills got pested by pesky vermins. Until the mess is cleaned no food may be produced.";
            },
            event: AvailableTragedyEvents.Vermins,
            image: "rat",
            name: "Plague of vermins",
            weight: 0.09
        },
        {
            effect: function (store) {
                store.dispatch(tragedy_events_1.pausedResourceProduction, AvailableTragedyEvents.Rockfall);
                return "Those giant boulders set loose and burried few of your men. It will take a while until the next shipment is ready.";
            },
            event: AvailableTragedyEvents.Rockfall,
            image: "falling-rocks",
            name: "The rockfall",
            weight: 0.09
        },
        {
            effect: function (store) {
                store.dispatch(tragedy_events_1.pausedResourceProduction, AvailableTragedyEvents.ShatteringEarth);
                return "A mighty earth quake shattered your mana rifts. It is nature that shows it's endless power. It will take a wihle until further veils can be casted.";
            },
            event: AvailableTragedyEvents.ShatteringEarth,
            image: "earth-spit",
            name: "Shattering earth",
            weight: 0.09
        },
        {
            effect: function (store) {
                store.dispatch(tragedy_events_1.pausedResourceProduction, AvailableTragedyEvents.BurningTrees);
                return "A morron with a torch, none of wisdom on his porch, set ablaze your woods. No more lumber is going soon to find the routes.";
            },
            event: AvailableTragedyEvents.BurningTrees,
            image: "burning-tree",
            name: "Burning trees",
            weight: 0.09
        },
        {
            effect: function (store) {
                store.dispatch(tragedy_events_1.pausedResourceProduction, AvailableTragedyEvents.ContaminatedBlood);
                return "One of the corpses was filled with evil gazes. It will take a while to harvest another crop.";
            },
            event: AvailableTragedyEvents.ContaminatedBlood,
            image: "infested-mass",
            name: "Contaminated blood",
            weight: 0.09
        }
    ];
});
;
define('text!board/tragedy.html',[],function(){return "<template class=\"tragedy\">\n  <h4 class=\"tragedy__header\">${event.name}</h4>\n  <img src=\"assets/icons/${event.image}.svg\"\n       class=\"tragedy__image\">\n  <p class=\"tragedy__description\">${event.effect(store, state)}</p>\n  <button class=\"tragedy__button\"\n          data-aid=\"btn-tragedy-accept\"\n          click.trigger=\"controller.ok()\">${event.event === -1 ? \"Praise the gods and continue your journey\" : \"Accept\n    the fate\"}</button>\n</template>\n";});;
define('buildings/index',["require", "exports", "./purchase-panel", "./tile-building"], function (require, exports, purchase_panel_1, tile_building_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function configure(config) {
        config.globalResources([
            purchase_panel_1.PurchasePanel,
            tile_building_1.TileBuilding
        ]);
    }
    exports.configure = configure;
});
;
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('buildings/purchase-panel',["require", "exports", "aurelia-dialog", "aurelia-framework", "aurelia-store", "../board/tile", "../store/index", "./tile-building"], function (require, exports, aurelia_dialog_1, aurelia_framework_1, aurelia_store_1, tile_1, index_1, tile_building_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var PurchasePanel = (function () {
        function PurchasePanel(store, controller) {
            this.store = store;
            this.controller = controller;
        }
        PurchasePanel.prototype.activate = function (model) {
            this.tile = model.tile;
            this.tileBuilding = model.tileBuilding;
            this.resources = model.resources;
            this.dialogView = model.view;
            this.bemclasses = model.bem;
        };
        Object.defineProperty(PurchasePanel.prototype, "building", {
            get: function () {
                return tile_building_1.TileBuildingsMap[this.tile.type];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PurchasePanel.prototype, "costs", {
            get: function () {
                var entries = Object.entries(tile_building_1.TileBuildingResourceCost[this.building]).filter(function (r) { return r[1] !== 0; });
                return entries.map(function (e) { return ({
                    icon: index_1.ResourcesIcons[e[0]],
                    resource: e[0],
                    value: e[1],
                }); });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PurchasePanel.prototype, "sufficientResources", {
            get: function () {
                var _this = this;
                return !this.costs.some(function (c) { return _this.resources[c.resource] - c.value < 0; });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PurchasePanel.prototype, "buildingIcon", {
            get: function () {
                return tile_building_1.TileBuildingsIcon[this.building];
            },
            enumerable: true,
            configurable: true
        });
        PurchasePanel.prototype.buyBuilding = function () {
            var newBuilding = {};
            newBuilding.tileId = this.tile.id;
            newBuilding.type = tile_building_1.TileBuildingsMap[this.tile.type];
            newBuilding.placement = this.tile.placement;
            this.store.dispatch(index_1.buyBuilding, newBuilding);
            this.controller.ok();
        };
        PurchasePanel.prototype.closePanel = function () {
            this.store.dispatch(index_1.closePurchasePanel);
            this.controller.cancel();
        };
        __decorate([
            aurelia_framework_1.bindable(),
            __metadata("design:type", tile_1.Tile)
        ], PurchasePanel.prototype, "tile", void 0);
        __decorate([
            aurelia_framework_1.bindable(),
            __metadata("design:type", tile_building_1.TileBuilding)
        ], PurchasePanel.prototype, "tileBuilding", void 0);
        __decorate([
            aurelia_framework_1.bindable(),
            __metadata("design:type", Object)
        ], PurchasePanel.prototype, "resources", void 0);
        __decorate([
            aurelia_framework_1.computedFrom("tile"),
            __metadata("design:type", Object),
            __metadata("design:paramtypes", [])
        ], PurchasePanel.prototype, "building", null);
        __decorate([
            aurelia_framework_1.computedFrom("tile"),
            __metadata("design:type", Object),
            __metadata("design:paramtypes", [])
        ], PurchasePanel.prototype, "costs", null);
        __decorate([
            aurelia_framework_1.computedFrom("resources"),
            __metadata("design:type", Object),
            __metadata("design:paramtypes", [])
        ], PurchasePanel.prototype, "sufficientResources", null);
        __decorate([
            aurelia_framework_1.computedFrom("tileBuilding"),
            __metadata("design:type", Object),
            __metadata("design:paramtypes", [])
        ], PurchasePanel.prototype, "buildingIcon", null);
        PurchasePanel = __decorate([
            aurelia_framework_1.autoinject(),
            __metadata("design:paramtypes", [aurelia_store_1.Store,
                aurelia_dialog_1.DialogController])
        ], PurchasePanel);
        return PurchasePanel;
    }());
    exports.PurchasePanel = PurchasePanel;
});
;
define('text!buildings/purchase-panel.html',[],function(){return "<template class=\"purchase-panel\">\n  <h4 class=\"purchase-panel__header\">Building</h4>\n\n  <ul class=\"purchase-panel__list\">\n    <li class=\"purchase-panel__item\">\n      <span class=\"purchase-panel__building-name\">\n        <img title.bind=\"building\"\n             class=\"purchase-panel__building-icon\"\n             src=\"assets/icons/${buildingIcon}.svg\" />\n      </span>\n      <ul class=\"purchase-panel__cost cost\">\n        <li repeat.for=\"cost of costs\"\n            class=\"cost__item\">\n          <img src=\"assets/icons/${cost.icon}.svg\"\n               title=\"cost.resource\"\n               class=\"cost__icon\" />\n          <span class=\"cost__value\">${cost.value}</span>\n        </li>\n      </ul>\n      <button class=\"purchase-panel__buy\"\n              click.trigger=\"buyBuilding()\"\n              data-aid=\"btn-buy\"\n              disabled.bind=\"tileBuilding || !sufficientResources\"\n              title.bind=\"!sufficientResources ? 'Not enough resources' : 'Buy'\">Buy</button>\n    </li>\n  </ul>\n\n  <button class=\"purchase-panel__close\"\n          click.trigger=\"closePanel()\">Close</button>\n</template>\n";});;
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('buildings/tile-building',["require", "exports", "aurelia-framework"], function (require, exports, aurelia_framework_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TileBuildingsIcon;
    (function (TileBuildingsIcon) {
        TileBuildingsIcon["butchery"] = "meat-cleaver";
        TileBuildingsIcon["coal_mine"] = "coal-wagon";
        TileBuildingsIcon["farm"] = "windmill";
        TileBuildingsIcon["gold_mine"] = "gold-mine";
        TileBuildingsIcon["iron_mine"] = "mining";
        TileBuildingsIcon["mana_rift"] = "magic-portal";
        TileBuildingsIcon["quarry"] = "stone-crafting";
        TileBuildingsIcon["sawmill"] = "crosscut-saw";
        TileBuildingsIcon["shrine"] = "fire-shrine";
    })(TileBuildingsIcon = exports.TileBuildingsIcon || (exports.TileBuildingsIcon = {}));
    exports.TileBuildingResourceCost = {
        butchery: {
            blood: 0,
            coal: 0,
            food: 0,
            gold: 10,
            iron: 0,
            mana: 0,
            stone: 0,
            wood: 10
        },
        coal_mine: {
            blood: 0,
            coal: 0,
            food: 0,
            gold: 10,
            iron: 0,
            mana: 0,
            stone: 0,
            wood: 10
        },
        farm: {
            blood: 0,
            coal: 0,
            food: 0,
            gold: 6,
            iron: 0,
            mana: 0,
            stone: 0,
            wood: 6
        },
        gold_mine: {
            blood: 0,
            coal: 0,
            food: 7,
            gold: 0,
            iron: 0,
            mana: 0,
            stone: 5,
            wood: 12
        },
        iron_mine: {
            blood: 0,
            coal: 0,
            food: 0,
            gold: 10,
            iron: 0,
            mana: 0,
            stone: 0,
            wood: 10
        },
        mana_rift: {
            blood: 0,
            coal: 0,
            food: 0,
            gold: 10,
            iron: 0,
            mana: 0,
            stone: 0,
            wood: 10
        },
        quarry: {
            blood: 0,
            coal: 0,
            food: 5,
            gold: 8,
            iron: 0,
            mana: 0,
            stone: 0,
            wood: 9
        },
        sawmill: {
            blood: 0,
            coal: 0,
            food: 0,
            gold: 5,
            iron: 0,
            mana: 0,
            stone: 0,
            wood: 4
        },
        shrine: {
            blood: 0,
            coal: 0,
            food: 10,
            gold: 15,
            iron: 0,
            mana: 0,
            stone: 10,
            wood: 10
        }
    };
    exports.TileBuildingsMap = {
        blood: "butchery",
        coal: "coal_mine",
        food: "farm",
        gold: "gold_mine",
        iron: "iron_mine",
        mana: "mana_rift",
        sacred_grounds: "shrine",
        stone: "quarry",
        wood: "sawmill",
    };
    var TileBuilding = (function () {
        function TileBuilding() {
        }
        __decorate([
            aurelia_framework_1.bindable,
            __metadata("design:type", String)
        ], TileBuilding.prototype, "tileId", void 0);
        __decorate([
            aurelia_framework_1.bindable,
            __metadata("design:type", String)
        ], TileBuilding.prototype, "type", void 0);
        __decorate([
            aurelia_framework_1.bindable,
            __metadata("design:type", String)
        ], TileBuilding.prototype, "placement", void 0);
        return TileBuilding;
    }());
    exports.TileBuilding = TileBuilding;
});
;
define('text!buildings/tile-building.html',[],function(){return "<template class=\"${bem('tile-building', '', [placement])}\">\n  <div class=\"${bem('tile-building', 'display', [type, placement])}\"></div>\n</template>\n";});;
define('commands/command-bar',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var CommandBar = (function () {
        function CommandBar() {
        }
        return CommandBar;
    }());
    exports.CommandBar = CommandBar;
});
;
define('text!commands/command-bar.html',[],function(){return "<template class=\"command-bar\">\n  <dice></dice>\n  <resources-overview></resources-overview>\n  <tragedy-overview></tragedy-overview>\n  <save></save>\n</template>\n";});;
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('commands/dice',["require", "exports", "aurelia-framework", "aurelia-store", "rxjs/operators", "../store/index"], function (require, exports, aurelia_framework_1, aurelia_store_1, operators_1, index_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Dice = (function () {
        function Dice(store) {
            this.store = store;
        }
        Dice.prototype.rollDice = function () {
            this.store.dispatch(index_1.rollDice);
        };
        Dice = __decorate([
            aurelia_framework_1.autoinject(),
            aurelia_store_1.connectTo(function (state) { return state.state.pipe(operators_1.map(function (value) { return ({ lastDiceRoll: value.lastDiceRoll, round: value.round }); })); }),
            __metadata("design:paramtypes", [aurelia_store_1.Store])
        ], Dice);
        return Dice;
    }());
    exports.Dice = Dice;
});
;
define('text!commands/dice.html',[],function(){return "<template class=\"command dice\"\n          title=\"Roll the dice\">\n  <h2 class=\"dice__round\" data-aid=\"current-round\">Round ${state.round}</h2>\n  <img src=\"assets/icons/dice.svg\"\n       click.trigger=\"rollDice()\"\n       class=\"command__icon dice__icon\"\n       data-aid=\"btn-dice-roll\" />\n\n  <span class=\"dice__last-roll\">${state.lastDiceRoll || 'none'}</span>\n</template>\n";});;
define('commands/index',["require", "exports", "./command-bar", "./dice", "./resources-overview", "./save", "./tragedy-overview"], function (require, exports, command_bar_1, dice_1, resources_overview_1, save_1, tragedy_overview_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function configure(config) {
        config.globalResources([
            command_bar_1.CommandBar,
            dice_1.Dice,
            resources_overview_1.ResourcesOverview,
            save_1.Save,
            tragedy_overview_1.TragedyOverview
        ]);
    }
    exports.configure = configure;
});
;
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('commands/resources-overview',["require", "exports", "aurelia-framework", "aurelia-store", "lodash", "rxjs/operators", "../store/state"], function (require, exports, aurelia_framework_1, aurelia_store_1, lodash_1, operators_1, state_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ResourcesOverview = (function () {
        function ResourcesOverview() {
        }
        Object.defineProperty(ResourcesOverview.prototype, "resources", {
            get: function () {
                if (!this.state) {
                    return [];
                }
                return Object.entries(this.state)
                    .map(function (e) { return ({
                    icon: state_1.ResourcesIcons[e[0]],
                    name: lodash_1.upperFirst(e[0]),
                    value: e[1],
                }); });
            },
            enumerable: true,
            configurable: true
        });
        __decorate([
            aurelia_framework_1.computedFrom("state"),
            __metadata("design:type", Object),
            __metadata("design:paramtypes", [])
        ], ResourcesOverview.prototype, "resources", null);
        ResourcesOverview = __decorate([
            aurelia_store_1.connectTo(function (store) { return store.state.pipe(operators_1.pluck("resources")); })
        ], ResourcesOverview);
        return ResourcesOverview;
    }());
    exports.ResourcesOverview = ResourcesOverview;
});
;
define('text!commands/resources-overview.html',[],function(){return "<template class=\"resources-overview\">\n  <ul class=\"resources-overview__list\">\n    <li class=\"resources-overview__item\"\n        repeat.for=\"res of resources\">\n      <img title.bind=\"res.name\"\n           class=\"resources-overview__image\"\n           src=\"assets/icons/${res.icon}.svg\" />\n      <span class=\"resources-overview__value\">${res.value}</span>\n    </li>\n  </ul>\n</template>\n";});;
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('commands/save',["require", "exports", "aurelia-framework", "aurelia-store", "../store/state"], function (require, exports, aurelia_framework_1, aurelia_store_1, state_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Save = (function () {
        function Save(store) {
            this.store = store;
        }
        Save.prototype.newGame = function () {
            this.store.resetToState(state_1.initialState);
            window.localStorage.removeItem(state_1.LOCALSTORAGE_SAVE_KEY);
            window.location.reload();
        };
        Save.prototype.saveGame = function () {
            var data = new Blob([window.localStorage.getItem(state_1.LOCALSTORAGE_SAVE_KEY) || "{}"], { type: "application/json" });
            var url = window.URL.createObjectURL(data);
            var anchor = document.createElement("a");
            anchor.href = url;
            anchor.target = "_blank";
            anchor.download = "enforted-save.json";
            anchor.click();
            window.URL.revokeObjectURL(url);
        };
        Save = __decorate([
            aurelia_framework_1.autoinject(),
            __metadata("design:paramtypes", [aurelia_store_1.Store])
        ], Save);
        return Save;
    }());
    exports.Save = Save;
});
;
define('text!commands/save.html',[],function(){return "<template class=\"save\">\n  <div class=\"save__actions\">\n    <button class=\"save__to-file\"\n            click.trigger=\"saveGame()\">Save game</button>\n    <button class=\"save__new-game\"\n            click.trigger=\"newGame()\">New game</button>\n  </div>\n</template>\n";});;
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('commands/tragedy-overview',["require", "exports", "aurelia-framework", "aurelia-store", "rxjs/operators", "../board/tragedy"], function (require, exports, aurelia_framework_1, aurelia_store_1, operators_1, tragedy_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TragedyOverview = (function () {
        function TragedyOverview() {
        }
        Object.defineProperty(TragedyOverview.prototype, "tragedy", {
            get: function () {
                var _this = this;
                return tragedy_1.tragedyEvents.find(function (te) { return te.event === _this.state; });
            },
            enumerable: true,
            configurable: true
        });
        __decorate([
            aurelia_framework_1.computedFrom("state"),
            __metadata("design:type", Object),
            __metadata("design:paramtypes", [])
        ], TragedyOverview.prototype, "tragedy", null);
        TragedyOverview = __decorate([
            aurelia_store_1.connectTo(function (store) { return store.state.pipe(operators_1.pluck("activeTragedy")); })
        ], TragedyOverview);
        return TragedyOverview;
    }());
    exports.TragedyOverview = TragedyOverview;
});
;
define('text!commands/tragedy-overview.html',[],function(){return "<template class=\"tragedy-overview\">\n  <img src=\"assets/icons/${tragedy.image}.svg\"\n       title.bind=\"tragedy.name\"\n       class=\"${bem('tragedy-overview', 'image', !tragedy && 'hidden')}\">\n</template>\n";});;
define('environment',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        debug: true,
        testing: true
    };
});
;
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define('main',["require", "exports", "./environment", "./store/index"], function (require, exports, environment_1, index_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    environment_1 = __importDefault(environment_1);
    function configure(aurelia) {
        aurelia.use
            .standardConfiguration()
            .plugin("aurelia-bem")
            .plugin("aurelia-store", {
            initialState: index_1.initialState
        })
            .plugin("aurelia-dialog")
            .feature("board")
            .feature("player")
            .feature("commands")
            .feature("buildings");
        aurelia.use.developmentLogging(environment_1.default.debug ? "debug" : "warn");
        if (environment_1.default.testing) {
            aurelia.use.plugin("aurelia-testing");
        }
        aurelia.start().then(function () { return aurelia.setRoot(); });
    }
    exports.configure = configure;
});
;
define('player/index',["require", "exports", "./player"], function (require, exports, player_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function configure(config) {
        config.globalResources([
            player_1.Player
        ]);
    }
    exports.configure = configure;
});
;
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('player/player',["require", "exports", "aurelia-framework", "aurelia-store"], function (require, exports, aurelia_framework_1, aurelia_store_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Player = (function () {
        function Player(store) {
            this.store = store;
            this.currentTile = {};
        }
        Player.prototype.currentTileIdChanged = function () {
            this.currentTile = this.store._state.getValue();
        };
        __decorate([
            aurelia_framework_1.bindable,
            __metadata("design:type", String)
        ], Player.prototype, "currentTileId", void 0);
        __decorate([
            aurelia_framework_1.bindable,
            __metadata("design:type", String)
        ], Player.prototype, "name", void 0);
        Player = __decorate([
            aurelia_framework_1.autoinject(),
            __metadata("design:paramtypes", [aurelia_store_1.Store])
        ], Player);
        return Player;
    }());
    exports.Player = Player;
});
;
define('text!player/player.html',[],function(){return "<template class=\"player\" data-aid=\"player\">\n  ${name}\n</template>\n";});;
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
define('store/actions/commands',["require", "exports", "../../board/tragedy", "../../buildings/tile-building", "../helper"], function (require, exports, tragedy_1, tile_building_1, helper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function rollDice(state, diceOverload) {
        var isStumblingStep = state.activeTragedy === tragedy_1.AvailableTragedyEvents.StumblingSteps;
        var idxOfTile = state.tiles.findIndex(function (t) { return t.id === state.players[0].currentTileId; });
        var roll = diceOverload || (isStumblingStep ? 1 : helper_1.randBetween(1, 6));
        var newPosition = idxOfTile + roll;
        var isNextRound = newPosition > state.tiles.length - 1;
        var newStumblingSteps = (state.activeTragedyParams === undefined || state.activeTragedyParams[0] === 1)
            ? undefined
            : [state.activeTragedyParams[0] - 1];
        return __assign(__assign({}, state), { activeTragedy: isNextRound
                ? undefined
                : isStumblingStep && newStumblingSteps === undefined
                    ? undefined
                    : state.activeTragedy, activeTragedyParams: isNextRound
                ? undefined
                : isStumblingStep
                    ? newStumblingSteps
                    : state.activeTragedyParams, lastDiceRoll: roll, players: [
                __assign(__assign({}, state.players[0]), { currentTileId: newPosition > state.tiles.length - 1
                        ? state.tiles[Math.abs(newPosition - state.tiles.length)].id
                        : state.tiles[newPosition].id })
            ], purchaseInProgress: undefined, resources: isNextRound
                ? gatherResources(state).resources
                : state.resources, round: isNextRound
                ? state.round + 1
                : state.round });
    }
    exports.rollDice = rollDice;
    exports.PRODUCED_RESOURCES_PER_ROUND = 3;
    function gatherResources(state) {
        var shrines = state.tileBuildings
            .filter(function (b) { return b.type === "shrine"; });
        var resourcesProduced = exports.PRODUCED_RESOURCES_PER_ROUND
            + (shrines.length === 4
                ? 1
                : 0);
        var resources = state.tileBuildings
            .filter(function (b) { return b.type !== "shrine"; })
            .filter(function (b) {
            switch (state.activeTragedy) {
                case tragedy_1.AvailableTragedyEvents.BurningTrees:
                    return b.type !== "sawmill";
                case tragedy_1.AvailableTragedyEvents.ContaminatedBlood:
                    return b.type !== "butchery";
                case tragedy_1.AvailableTragedyEvents.Rockfall:
                    return b.type !== "quarry";
                case tragedy_1.AvailableTragedyEvents.ShatteringEarth:
                    return b.type !== "mana_rift";
                case tragedy_1.AvailableTragedyEvents.Vermins:
                    return b.type !== "farm";
                case tragedy_1.AvailableTragedyEvents.CollapsedMines:
                    var mineType = state.activeTragedyParams[0];
                    return b.type !== mineType;
                default:
                    return true;
            }
        })
            .reduce(function (prev, curr) {
            prev[state.tiles
                .find(function (t) { return t.id === curr.tileId; })
                .type] += resourcesProduced;
            return prev;
        }, Object.assign({}, state.resources));
        return gatherShrineResources(__assign(__assign({}, state), { resources: resources }));
    }
    exports.gatherResources = gatherResources;
    function gatherShrineResources(state) {
        var shrines = state.tileBuildings
            .filter(function (b) { return b.type === "shrine"; });
        if (!shrines) {
            return state;
        }
        return __assign(__assign({}, state), { resources: __assign(__assign({}, state.resources), { blood: shrines.length > 2 ? state.resources.blood + 1 : state.resources.blood, gold: shrines.length > 0 ? state.resources.gold + 1 : state.resources.gold, mana: shrines.length > 1 ? state.resources.mana + 1 : state.resources.mana }) });
    }
    exports.gatherShrineResources = gatherShrineResources;
    function openPurchaseForTile(state, tile) {
        return __assign(__assign({}, state), { purchaseInProgress: tile.id });
    }
    exports.openPurchaseForTile = openPurchaseForTile;
    function closePurchasePanel(state) {
        return __assign(__assign({}, state), { purchaseInProgress: undefined });
    }
    exports.closePurchasePanel = closePurchasePanel;
    function buyBuilding(state, building) {
        var costs = tile_building_1.TileBuildingResourceCost[building.type];
        return __assign(__assign({}, state), { purchaseInProgress: undefined, resources: {
                blood: state.resources.blood - costs.blood,
                coal: state.resources.coal - costs.coal,
                food: state.resources.food - costs.food,
                gold: state.resources.gold - costs.gold,
                iron: state.resources.iron - costs.iron,
                mana: state.resources.mana - costs.mana,
                stone: state.resources.stone - costs.stone,
                wood: state.resources.wood - costs.wood,
            }, tileBuildings: __spreadArrays(state.tileBuildings, [
                building
            ]) });
    }
    exports.buyBuilding = buyBuilding;
});
;
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
define('store/actions/tragedy-events',["require", "exports", "../../board/tragedy", "../helper"], function (require, exports, tragedy_1, helper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function sacrificeResources(state, resourceType, byAmount) {
        var _a;
        return __assign(__assign({}, state), { activeTragedy: tragedy_1.AvailableTragedyEvents.Sacrifice, resources: __assign(__assign({}, state.resources), (_a = {}, _a[resourceType] = Math.max(0, state.resources[resourceType] - byAmount), _a)) });
    }
    exports.sacrificeResources = sacrificeResources;
    function ragingFire(state, tileId) {
        var idx = state.tileBuildings.findIndex(function (tb) { return tb.tileId === tileId; });
        return __assign(__assign({}, state), { activeTragedy: tragedy_1.AvailableTragedyEvents.RagingFire, tileBuildings: __spreadArrays(state.tileBuildings.slice(0, idx), state.tileBuildings.slice(idx + 1)) });
    }
    exports.ragingFire = ragingFire;
    function forgottenEquipment(state) {
        return __assign(__assign({}, state), { activeTragedy: undefined, activeTragedyParams: undefined, players: [
                __assign(__assign({}, state.players[0]), { currentTileId: state.tiles.find(function (t) { return t.type === "start"; }).id })
            ] });
    }
    exports.forgottenEquipment = forgottenEquipment;
    function defiledAltar(state) {
        var shrines = state.tileBuildings.filter(function (tb) { return tb.type === "shrine"; });
        var idx = helper_1.randBetween(0, shrines.length - 1);
        return __assign(__assign({}, state), { activeTragedy: tragedy_1.AvailableTragedyEvents.DefiledAltar, tileBuildings: __spreadArrays(state.tileBuildings.filter(function (tb) { return tb.tileId !== shrines[idx].tileId; })) });
    }
    exports.defiledAltar = defiledAltar;
    function pausedResourceProduction(state, tragedy) {
        return __assign(__assign({}, state), { activeTragedy: tragedy });
    }
    exports.pausedResourceProduction = pausedResourceProduction;
    function collapsedMines(state, mineType) {
        return __assign(__assign({}, state), { activeTragedy: tragedy_1.AvailableTragedyEvents.CollapsedMines, activeTragedyParams: [mineType] });
    }
    exports.collapsedMines = collapsedMines;
    function stumblingSteps(state) {
        return __assign(__assign({}, state), { activeTragedy: tragedy_1.AvailableTragedyEvents.StumblingSteps, activeTragedyParams: [3] });
    }
    exports.stumblingSteps = stumblingSteps;
});
;
define('store/helper',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + "-" + s4() + "-" + s4() + "-" +
            s4() + "-" + s4() + s4() + s4();
    }
    exports.guid = guid;
    function randBetween(min, max) {
        return Math.floor(Math.random() * max) + min;
    }
    exports.randBetween = randBetween;
});
;
define('store/index',["require", "exports", "./state", "./actions/commands"], function (require, exports, state_1, commands_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(state_1);
    __export(commands_1);
});
;
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
define('store/state',["require", "exports", "./helper"], function (require, exports, helper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LOCALSTORAGE_SAVE_KEY = "enforted-save-game";
    exports.ResourcesIcons = {
        blood: "bloody-stash",
        coal: "brick-pile",
        food: "wheat",
        gold: "two-coins",
        iron: "ore",
        mana: "vortex",
        stone: "stone-block",
        wood: "forest"
    };
    exports.initialState = {
        lastDiceRoll: undefined,
        players: [],
        resources: {
            blood: 0,
            coal: 0,
            food: 15,
            gold: 30,
            iron: 0,
            mana: 0,
            stone: 0,
            wood: 20,
        },
        round: 1,
        tileBuildings: [],
        tiles: __spreadArrays([
            {
                id: helper_1.guid(),
                isCorner: true,
                placement: "bottom",
                ring: "outer",
                type: "start"
            }
        ], Array.from(Array(9), function (_, idx) { return ({
            id: helper_1.guid(),
            isCorner: false,
            placement: "bottom",
            ring: "outer",
            type: "wood",
        }); }), [
            {
                id: helper_1.guid(),
                isCorner: true,
                placement: "bottom",
                ring: "outer",
                type: "sacred_grounds"
            }
        ], Array.from(Array(9), function () { return ({
            id: helper_1.guid(),
            isCorner: false,
            placement: "left",
            ring: "outer",
            type: "food",
        }); }), [
            {
                id: helper_1.guid(),
                isCorner: true,
                placement: "top",
                ring: "outer",
                type: "tragedy"
            }
        ], Array.from(Array(9), function (_, idx) { return ({
            id: helper_1.guid(),
            isCorner: false,
            placement: "top",
            ring: "outer",
            type: "stone",
        }); }), [
            {
                id: helper_1.guid(),
                isCorner: true,
                placement: "top",
                ring: "outer",
                type: "sacred_grounds"
            }
        ], Array.from(Array(9), function () { return ({
            id: helper_1.guid(),
            isCorner: false,
            placement: "right",
            ring: "outer",
            type: "gold",
        }); }), Array.from(Array(9), function (_, idx) { return ({
            id: helper_1.guid(),
            isCorner: idx === 0 || idx === 8,
            placement: "bottom",
            ring: "inner",
            type: "iron",
        }); }), Array.from(Array(7), function (_, idx) { return ({
            id: helper_1.guid(),
            isCorner: false,
            placement: "left",
            ring: "inner",
            type: idx === 4 ? "sacred_grounds" : "mana",
        }); }), Array.from(Array(8), function (_, idx) { return ({
            id: helper_1.guid(),
            isCorner: idx === 0,
            placement: "top",
            ring: "inner",
            type: "coal",
        }); }), [
            {
                id: helper_1.guid(),
                isCorner: true,
                placement: "top",
                ring: "inner",
                type: "tragedy"
            }
        ], Array.from(Array(7), function (_, idx) { return ({
            id: helper_1.guid(),
            isCorner: false,
            placement: "right",
            ring: "inner",
            type: idx === 6 ? "sacred_grounds" : "blood",
        }); }))
    };
    var player = {};
    player.name = "zewa";
    player.currentTileId = exports.initialState.tiles[0].id;
    exports.initialState.players.push(player);
});
;
define('text!utils/generic-dialog.html',[],function(){return "<template>\n  <ux-dialog>\n    <ux-dialog-body>\n      <compose class=\"${bemclasses}\" view.bind=\"dialogView\"></compose>\n    </ux-dialog-body>\n  </ux-dialog>\n</template>\n";});;
define('utils/utils',["require", "exports", "aurelia-dialog", "aurelia-framework", "lodash"], function (require, exports, aurelia_dialog_1, aurelia_framework_1, lodash_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function openDialog(viewModel, model, keyboard) {
        if (keyboard === void 0) { keyboard = false; }
        var dialogService = aurelia_framework_1.Container.instance.get(aurelia_dialog_1.DialogService);
        model.bem = model.bem || lodash_1.kebabCase(viewModel.name);
        return dialogService.open({
            centerHorizontalOnly: true,
            keyboard: keyboard,
            model: model,
            view: "utils/generic-dialog.html",
            viewModel: viewModel,
        });
    }
    exports.openDialog = openDialog;
});
;
define('board',['board/index'],function(m){return m;});
define('buildings',['buildings/index'],function(m){return m;});
define('commands',['commands/index'],function(m){return m;});
define('player',['player/index'],function(m){return m;});
//# sourceMappingURL=app-bundle.js.map