var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
define('animator/animator',["require", "exports", "aurelia-templating"], function (require, exports, aurelia_templating_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var WebAnimationAnimator = (function (_super) {
        __extends(WebAnimationAnimator, _super);
        function WebAnimationAnimator() {
            var _this = _super !== null && _super.apply(this, arguments) || this;
            _this.isAnimating = false;
            _this.storedEnterAnimations = {};
            _this.storedLeaveAnimations = {};
            return _this;
        }
        WebAnimationAnimator.prototype.animate = function (element, keyframes, options) {
            var animation = element.animate(keyframes, options);
            return animation.finished.then(function () { return true; });
        };
        WebAnimationAnimator.prototype.runSequence = function (animations) {
            return Promise.resolve(false);
        };
        WebAnimationAnimator.prototype.enter = function (element) {
            var settings = Object.assign({
                keyframes: { opacity: [0, 1] },
                options: 2000
            }, this.storedEnterAnimations[element.tagName]);
            var animation = element.animate(settings.keyframes, settings.options);
            return animation.finished.then(function () { return true; });
        };
        WebAnimationAnimator.prototype.leave = function (element) {
            var settings = Object.assign({
                keyframes: { opacity: [0, 1] },
                options: 2000
            }, this.storedLeaveAnimations[element.tagName]);
            var animation = element.animate(settings.keyframes, settings.options);
            return animation.finished.then(function () { return true; });
        };
        WebAnimationAnimator.prototype.removeClass = function (element, className, suppressEvents) {
            if (suppressEvents === void 0) { suppressEvents = false; }
            return Promise.resolve(false);
        };
        WebAnimationAnimator.prototype.addClass = function (element, className, suppressEvents) {
            if (suppressEvents === void 0) { suppressEvents = false; }
            return Promise.resolve(false);
        };
        return WebAnimationAnimator;
    }(aurelia_templating_1.Animator));
    exports.WebAnimationAnimator = WebAnimationAnimator;
    if (document.body.animate) {
        if (typeof Animation === "undefined") {
            window.Animation = document.body.animate({}).constructor;
        }
        if (Animation.prototype.finished === undefined) {
            Object.defineProperty(Animation.prototype, "finished", {
                get: function () {
                    var _this = this;
                    if (!this._finished) {
                        this._finished = this.playState === "finished" ?
                            Promise.resolve() :
                            new Promise(function (resolve, reject) {
                                _this.addEventListener("finish", resolve, { once: true });
                                _this.addEventListener("cancel", reject, { once: true });
                            });
                    }
                    return this._finished;
                }
            });
        }
    }
});
;
define('animator/index',["require", "exports", "aurelia-templating", "./animator"], function (require, exports, aurelia_templating_1, animator_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function configure(config, callback) {
        var animator = config.container.get(animator_1.WebAnimationAnimator);
        config.container.get(aurelia_templating_1.TemplatingEngine).configureAnimator(animator);
        if (typeof callback === "function") {
            callback(animator);
        }
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
define('app',["require", "exports", "aurelia-dialog", "aurelia-event-aggregator", "aurelia-framework", "aurelia-store", "rxjs/operators", "./store/actions/tragedy-events", "./store/index"], function (require, exports, aurelia_dialog_1, aurelia_event_aggregator_1, aurelia_framework_1, aurelia_store_1, operators_1, tragedy_events_1, index_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var App = (function () {
        function App(store, dialogService, ea) {
            var _this = this;
            this.store = store;
            this.dialogService = dialogService;
            this.ea = ea;
            this.sidebarVisible = true;
            this.handleGlobalKeys = function (event) {
                if (!_this.dialogService.hasOpenDialog && event.keyCode === 13) {
                    _this.ea.publish("key-shortcut", event.keyCode);
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
            this.store.registerAction("destroy a tile building", index_1.destroyBuilding);
            this.store.registerAction("[tragedy] sacrifice resources", tragedy_events_1.sacrificeResources);
            this.store.registerAction("[tragedy] raging fire", tragedy_events_1.ragingFire);
            this.store.registerAction("[tragedy] the forgotten equipment", tragedy_events_1.forgottenEquipment);
            this.store.registerAction("[tragedy] a defiled altar", tragedy_events_1.defiledAltar);
            this.store.registerAction("[tragedy] paused resource production", tragedy_events_1.pausedResourceProduction);
            this.store.registerAction("[tragey] collapsed mines", tragedy_events_1.collapsedMines);
            this.store.registerAction("[tragey] stumbling steps", tragedy_events_1.stumblingSteps);
            this.store.registerAction("buy fortress building", index_1.buyFortressBuilding);
            this.store.registerAction("reinforce tile building", index_1.reinforceTileBuilding);
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
                aurelia_dialog_1.DialogService,
                aurelia_event_aggregator_1.EventAggregator])
        ], App);
        return App;
    }());
    exports.App = App;
});
;
define('text!app.html',[],function(){return "<template>\n  <require from=\"./main.css\"></require>\n  <div class=\"app\">\n    <button class=\"app__toggle-sidebar\"\n            click.trigger=\"sidebarVisible = !sidebarVisible\">${!sidebarVisible ? \"⇶\" : \"⬱\"}</button>\n    <sidebar class=\"${bem('app', 'sidebar', !sidebarVisible ? 'hidden' : 'visible')}\"></sidebar>\n    <board class=\"app__board\"></board>\n  </div>\n</template>\n";});;
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('board/board',["require", "exports", "aurelia-framework", "aurelia-store", "../utils/utils", "./game-over"], function (require, exports, aurelia_framework_1, aurelia_store_1, utils_1, game_over_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Board = (function () {
        function Board(store) {
            var _this = this;
            this.store = store;
            this.subscription = this.store.state.subscribe(function (state) {
                _this.state = state;
                if (state.stats.population <= 0) {
                    utils_1.openDialog(game_over_1.GameOver, {
                        view: "board/game-over.html",
                    });
                }
            });
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
define('text!board/board.html',[],function(){return "<template class=\"board\">\n  <div class=\"board__row board__row--top\">\n    <tile repeat.for=\"tile of getTiles('outer', 'top')\"\n          class=\"tile--top\"\n          type.bind=\"tile.type\"\n          is-corner.bind=\"tile.isCorner\"\n          ring.bind=\"tile.ring\"\n          id.bind=\"tile.id\"\n          placement.bind=\"tile.placement\"\n          players.bind=\"state.players\"\n          monsters.bind=\"state.monsters\"\n          stats.bind=\"state.stats\"\n          resources.bind=\"state.resources\"\n          tile-buildings.bind=\"state.tileBuildings\"></tile>\n  </div>\n  <div class=\"board__row board__row--center\">\n    <div class=\"${bem('board', 'col', 'left')}\">\n      <tile repeat.for=\"tile of getTiles('outer', 'left')\"\n            class=\"tile--left\"\n            type.bind=\"tile.type\"\n            is-corner.bind=\"tile.isCorner\"\n            ring.bind=\"tile.ring\"\n            id.bind=\"tile.id\"\n            placement.bind=\"tile.placement\"\n            players.bind=\"state.players\"\n            monsters.bind=\"state.monsters\"\n            stats.bind=\"state.stats\"\n            resources.bind=\"state.resources\"\n            tile-buildings.bind=\"state.tileBuildings\"></tile>\n    </div>\n    <div class=\"${bem('board', 'col', 'center')}\">\n\n      <!-- Inner circle -->\n      <div class=\"board__row board__row--top\">\n        <tile repeat.for=\"tile of getTiles('inner', 'top')\"\n              class=\"tile--top\"\n              type.bind=\"tile.type\"\n              is-corner.bind=\"tile.isCorner\"\n              ring.bind=\"tile.ring\"\n              id.bind=\"tile.id\"\n              placement.bind=\"tile.placement\"\n              players.bind=\"state.players\"\n              monsters.bind=\"state.monsters\"\n              stats.bind=\"state.stats\"\n              resources.bind=\"state.resources\"\n              tile-buildings.bind=\"state.tileBuildings\"></tile>\n      </div>\n      <div class=\"board__row board__row--center\">\n        <div class=\"${bem('board', 'col', 'left')}\">\n          <tile repeat.for=\"tile of getTiles('inner', 'left')\"\n                class=\"tile--left\"\n                type.bind=\"tile.type\"\n                is-corner.bind=\"tile.isCorner\"\n                ring.bind=\"tile.ring\"\n                id.bind=\"tile.id\"\n                placement.bind=\"tile.placement\"\n                players.bind=\"state.players\"\n                monsters.bind=\"state.monsters\"\n                stats.bind=\"state.stats\"\n                resources.bind=\"state.resources\"\n                tile-buildings.bind=\"state.tileBuildings\"></tile>\n        </div>\n        <div class=\"${bem('board', 'col', 'center')}\">\n          <fortress class=\"board__fortress\"></fortress>\n        </div>\n        <div class=\"${bem('board', 'col', 'right')}\">\n          <tile repeat.for=\"tile of getTiles('inner', 'right')\"\n                class=\"tile--right\"\n                type.bind=\"tile.type\"\n                is-corner.bind=\"tile.isCorner\"\n                ring.bind=\"tile.ring\"\n                id.bind=\"tile.id\"\n                placement.bind=\"tile.placement\"\n                players.bind=\"state.players\"\n                monsters.bind=\"state.monsters\"\n                stats.bind=\"state.stats\"\n                resources.bind=\"state.resources\"\n                tile-buildings.bind=\"state.tileBuildings\"></tile>\n        </div>\n      </div>\n      <div class=\"board__row board__row--bottom\">\n        <tile repeat.for=\"tile of getTiles('inner', 'bottom')\"\n              class=\"tile--bottom\"\n              type.bind=\"tile.type\"\n              is-corner.bind=\"tile.isCorner\"\n              ring.bind=\"tile.ring\"\n              id.bind=\"tile.id\"\n              placement.bind=\"tile.placement\"\n              players.bind=\"state.players\"\n              monsters.bind=\"state.monsters\"\n              stats.bind=\"state.stats\"\n              resources.bind=\"state.resources\"\n              tile-buildings.bind=\"state.tileBuildings\"></tile>\n      </div>\n      <!-- /Inner circle -->\n\n    </div>\n    <div class=\"${bem('board', 'col', 'right')}\">\n      <tile repeat.for=\"tile of getTiles('outer', 'right')\"\n            class=\"tile--right\"\n            type.bind=\"tile.type\"\n            is-corner.bind=\"tile.isCorner\"\n            ring.bind=\"tile.ring\"\n            id.bind=\"tile.id\"\n            placement.bind=\"tile.placement\"\n            players.bind=\"state.players\"\n            monsters.bind=\"state.monsters\"\n            stats.bind=\"state.stats\"\n            resources.bind=\"state.resources\"\n            tile-buildings.bind=\"state.tileBuildings\"></tile>\n    </div>\n  </div>\n  <div class=\"board__row board__row--bottom\">\n    <tile repeat.for=\"tile of getTiles('outer', 'bottom')\"\n          class=\"tile--bottom\"\n          type.bind=\"tile.type\"\n          is-corner.bind=\"tile.isCorner\"\n          ring.bind=\"tile.ring\"\n          id.bind=\"tile.id\"\n          placement.bind=\"tile.placement\"\n          players.bind=\"state.players\"\n          monsters.bind=\"state.monsters\"\n          stats.bind=\"state.stats\"\n          resources.bind=\"state.resources\"\n          tile-buildings.bind=\"state.tileBuildings\"></tile>\n  </div>\n</template>\n";});;
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
define('board/fortress',["require", "exports", "aurelia-store"], function (require, exports, aurelia_store_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Fortress = (function () {
        function Fortress() {
        }
        Fortress = __decorate([
            aurelia_store_1.connectTo()
        ], Fortress);
        return Fortress;
    }());
    exports.Fortress = Fortress;
});
;
define('text!board/fortress.html',[],function(){return "<template class=\"fortress\">\n  <span class=\"fortress__caption\">Fortress</span>\n\n  <div class=\"fortress__buildings\">\n    <fortress-building repeat.for=\"building of state.fortressBuildings\"\n                       type.bind=\"building.type\"\n                       class=\"fortress__building\"></fortress-building>\n  </div>\n</template>\n";});;
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('board/game-over',["require", "exports", "aurelia-framework", "aurelia-store", "../store/index"], function (require, exports, aurelia_framework_1, aurelia_store_1, index_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var GameOver = (function () {
        function GameOver(store) {
            this.store = store;
        }
        GameOver.prototype.newGame = function () {
            this.store.resetToState(index_1.initialState);
            window.localStorage.removeItem(index_1.LOCALSTORAGE_SAVE_KEY);
            window.location.reload();
        };
        GameOver.prototype.activate = function (model) {
            this.dialogView = model.view;
            this.bemclasses = model.bem;
        };
        GameOver = __decorate([
            aurelia_framework_1.autoinject(),
            __metadata("design:paramtypes", [aurelia_store_1.Store])
        ], GameOver);
        return GameOver;
    }());
    exports.GameOver = GameOver;
});
;
define('text!board/game-over.html',[],function(){return "<template class=\"game-over\">\n  <h4 class=\"game-over__header\">Game over</h4>\n\n  <p class=\"game-over__text\">You fought brave, you fought ferocious.<br />\n    But as the night fell so has your fort.<br />\n    Tis' not the end though. <br />\n    Start your journey anew and prepare better this time.</p>\n\n  <button class=\"game-over__new-game\"\n          click.trigger=\"newGame()\">Restart game</button>\n</template>\n";});;
define('board/index',["require", "exports", "./board", "./fortress", "./game-over", "./tile", "./tragedy"], function (require, exports, board_1, fortress_1, game_over_1, tile_1, tragedy_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function configure(config) {
        config.globalResources([
            board_1.Board,
            fortress_1.Fortress,
            game_over_1.GameOver,
            tile_1.Tile,
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
define('board/tile',["require", "exports", "aurelia-framework", "aurelia-store", "lodash", "../animator/animator", "../buildings/construction-panel", "../buildings/purchase-panel", "../store/index", "../utils/utils", "./tragedy"], function (require, exports, aurelia_framework_1, aurelia_store_1, lodash_1, animator_1, construction_panel_1, purchase_panel_1, index_1, utils_1, tragedy_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Tile = (function () {
        function Tile(store, animator, element) {
            this.store = store;
            this.animator = animator;
            this.element = element;
            this.isCorner = false;
            this.players = [];
            this.monsters = [];
            this.tileBuildings = [];
        }
        Tile.prototype.playersChanged = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!(this.type === "tragedy" && this.isPlayerOnTile)) return [3, 2];
                            this.animator.animate(this.element, {
                                backgroundColor: ["transparent", "red", "transparent", "red"]
                            }, 2000);
                            return [4, utils_1.openDialog(tragedy_1.Tragedy, {
                                    view: "board/tragedy.html"
                                }, "Enter")];
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
        Object.defineProperty(Tile.prototype, "monstersOnTile", {
            get: function () {
                var _this = this;
                var _a;
                return (_a = this.monsters) === null || _a === void 0 ? void 0 : _a.filter(function (p) { return p.currentTileId === _this.id; });
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
        Object.defineProperty(Tile.prototype, "typeName", {
            get: function () {
                return lodash_1.capitalize(this.type.replace(/_|-/g, " "));
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
                            if (!(!["start", "rally_point", "tragedy",
                                "construction-site", "fire_fountain"].includes(this.type) && this.isPlayerOnTile)) return [3, 2];
                            return [4, this.store.dispatch(index_1.openPurchaseForTile, this)];
                        case 1:
                            _b.sent();
                            utils_1.openDialog(purchase_panel_1.PurchasePanel, {
                                resources: this.resources,
                                stats: this.stats,
                                tile: this,
                                tileBuilding: (_a = this.tileBuildings) === null || _a === void 0 ? void 0 : _a.find(function (b) { return b.tileId === _this.id; }),
                                view: "buildings/purchase-panel.html",
                            });
                            return [3, 3];
                        case 2:
                            if (this.type === "construction-site" && this.isPlayerOnTile) {
                                utils_1.openDialog(construction_panel_1.ConstructionPanel, {
                                    resources: this.resources,
                                    view: "buildings/construction-panel.html",
                                });
                            }
                            _b.label = 3;
                        case 3: return [2];
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
        ], Tile.prototype, "monsters", void 0);
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
            aurelia_framework_1.bindable,
            __metadata("design:type", Object)
        ], Tile.prototype, "stats", void 0);
        __decorate([
            aurelia_framework_1.computedFrom("players"),
            __metadata("design:type", Object),
            __metadata("design:paramtypes", [])
        ], Tile.prototype, "isPlayerOnTile", null);
        __decorate([
            aurelia_framework_1.computedFrom("monsters"),
            __metadata("design:type", Object),
            __metadata("design:paramtypes", [])
        ], Tile.prototype, "monstersOnTile", null);
        __decorate([
            aurelia_framework_1.computedFrom("tileBuildings"),
            __metadata("design:type", Object),
            __metadata("design:paramtypes", [])
        ], Tile.prototype, "isBuildingOnTile", null);
        __decorate([
            aurelia_framework_1.computedFrom("type"),
            __metadata("design:type", Object),
            __metadata("design:paramtypes", [])
        ], Tile.prototype, "typeName", null);
        Tile = __decorate([
            aurelia_framework_1.autoinject(),
            __metadata("design:paramtypes", [aurelia_store_1.Store,
                animator_1.WebAnimationAnimator,
                Element])
        ], Tile);
        return Tile;
    }());
    exports.Tile = Tile;
});
;
define('text!board/tile.html',[],function(){return "<template title.bind=\"typeName\"\n          dblclick.delegate=\"openPurchasePanel()\"\n          class=\"${bem('tile', '', [type, isCorner && 'corner'])}\">\n  <player repeat.for=\"player of players\"\n          if.bind=\"isPlayerOnTile\"\n          class=\"tile__player\"\n          name.bind=\"player.name\"\n          current-tile-id.bind=\"$parent.id\"></player>\n\n  <tile-building if.bind=\"isBuildingOnTile\"\n                 tile-id.bind=\"id\"\n                 type.bind=\"tileBuilding.type\"\n                 placement.bind=\"placement\"></tile-building>\n\n  <monster repeat.for=\"monster of monstersOnTile\"\n           if.bind=\"monstersOnTile\"\n           class=\"tile__monster\"\n           current-tile-id.bind=\"$parent.id\"\n           stats.bind=\"monster.stats\"\n           type.bind=\"monster.type\"></monster>\n</template>\n";});;
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
define('text!board/tragedy.html',[],function(){return "<template class=\"tragedy\">\n  <h4 class=\"tragedy__header\">${event.name}</h4>\n  <img src=\"assets/icons/${event.image}.svg\"\n       class=\"tragedy__image\"\n       alt=\"The chosen tragedy\">\n  <p class=\"tragedy__description\">${event.effect(store, state)}</p>\n  <button class=\"tragedy__button\"\n          data-aid=\"btn-tragedy-accept\"\n          click.trigger=\"controller.ok()\">${event.event === -1 ? \"Praise the gods and continue your journey\" : \"Accept\n    the fate\"}</button>\n</template>\n";});;
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
define('buildings/construction-panel',["require", "exports", "aurelia-dialog", "aurelia-framework", "aurelia-store", "lodash", "rxjs/operators", "../resources/index", "../store/index", "./fortress-building"], function (require, exports, aurelia_dialog_1, aurelia_framework_1, aurelia_store_1, lodash_1, operators_1, index_1, index_2, fortress_building_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ConstructionPanel = (function () {
        function ConstructionPanel(store, controller) {
            this.store = store;
            this.controller = controller;
            this.currentBuildingIdx = 0;
        }
        Object.defineProperty(ConstructionPanel.prototype, "building", {
            get: function () {
                return this.fortressBuildings[this.currentBuildingIdx];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ConstructionPanel.prototype, "buildingsLeftToBuild", {
            get: function () {
                return !!this.fortressBuildings.length;
            },
            enumerable: true,
            configurable: true
        });
        ConstructionPanel.prototype.activate = function (model) {
            var _this = this;
            this.resources = model.resources;
            this.dialogView = model.view;
            this.bemclasses = model.bem;
            this.store.state.pipe(operators_1.take(1)).subscribe(function (state) {
                _this.buildingInProgress = !!state.activeFortressBuildingConstruction;
                _this.fortressBuildings = fortress_building_1.AllFortressBuildings.filter(function (b) {
                    return !state.fortressBuildings.find(function (fb) { return fb.type === b; });
                }).map(function (b) {
                    var buildingCosts = Object.entries(fortress_building_1.FortressBuildingResourceCost[b]).filter(function (r) { return r[1] !== 0; });
                    var costs = buildingCosts.map(function (e) { return ({
                        icon: index_1.ResourcesIcons[e[0]],
                        resource: e[0],
                        value: e[1],
                    }); });
                    return {
                        costs: costs,
                        icon: fortress_building_1.FortressBuildingIcon[b],
                        name: lodash_1.capitalize(b.replace(/_/g, " ")),
                        sufficientResources: !costs.some(function (c) { return _this.resources[c.resource] - c.value < 0; }),
                        type: b
                    };
                });
            });
        };
        ConstructionPanel.prototype.closePanel = function () {
            this.controller.cancel();
        };
        ConstructionPanel.prototype.toggleBuilding = function (direction) {
            if (direction === "+") {
                this.currentBuildingIdx = (this.currentBuildingIdx + 1) > (this.fortressBuildings.length - 1)
                    ? 0
                    : this.currentBuildingIdx + 1;
            }
            else {
                this.currentBuildingIdx = (this.currentBuildingIdx - 1) < 0
                    ? this.fortressBuildings.length - 1
                    : this.currentBuildingIdx - 1;
            }
        };
        ConstructionPanel.prototype.buyBuilding = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, this.store.dispatch(index_2.buyFortressBuilding, this.building.type)];
                        case 1:
                            _a.sent();
                            this.controller.ok();
                            return [2];
                    }
                });
            });
        };
        __decorate([
            aurelia_framework_1.bindable(),
            __metadata("design:type", Object)
        ], ConstructionPanel.prototype, "resources", void 0);
        __decorate([
            aurelia_framework_1.computedFrom("currentBuildingIdx"),
            __metadata("design:type", fortress_building_1.FortressBuilding),
            __metadata("design:paramtypes", [])
        ], ConstructionPanel.prototype, "building", null);
        __decorate([
            aurelia_framework_1.computedFrom("fortressBuildings"),
            __metadata("design:type", Object),
            __metadata("design:paramtypes", [])
        ], ConstructionPanel.prototype, "buildingsLeftToBuild", null);
        ConstructionPanel = __decorate([
            aurelia_framework_1.autoinject(),
            __metadata("design:paramtypes", [aurelia_store_1.Store,
                aurelia_dialog_1.DialogController])
        ], ConstructionPanel);
        return ConstructionPanel;
    }());
    exports.ConstructionPanel = ConstructionPanel;
});
;
define('text!buildings/construction-panel.html',[],function(){return "<template class=\"construction-panel\">\n  <h4 class=\"construction-panel__header\">Fortress Buildings</h4>\n  <div class=\"construction-panel__message\"\n       if.bind=\"!buildingsLeftToBuild\">No buildings left to construct</div>\n  <div class=\"construction-panel__message\"\n       if.bind=\"buildingsLeftToBuild && buildingInProgress\">Cannot construct another building this round</div>\n  <ul if.bind=\"buildingsLeftToBuild && !buildingInProgress\"\n      class=\"construction-panel__list\">\n    <li class=\"construction-panel__item\">\n      <div class=\"construction-panel__building-name\">\n        <button class=\"construction-panel__building-navigator\"\n                click.trigger=\"toggleBuilding('-')\">&#x2B05;</button>\n        <img title.bind=\"building.name\"\n             class=\"construction-panel__building-icon\"\n             alt=\"The buildings icon\"\n             src=\"assets/icons/${building.icon}.svg\" />\n        <button class=\"construction-panel__building-navigator\"\n                click.trigger=\"toggleBuilding('+')\">&#x27A1;</button>\n      </div>\n      <ul class=\"construction-panel__cost cost\">\n        <li repeat.for=\"cost of building.costs\"\n            class=\"cost__item\">\n          <img src=\"assets/icons/${cost.icon}.svg\"\n               title.bind=\"cost.resource\"\n               alt.bind=\"cost.resource\"\n               class=\"cost__icon\" />\n          <span class=\"cost__value\">${cost.value}</span>\n        </li>\n      </ul>\n      <button class=\"construction-panel__buy\"\n              click.trigger=\"buyBuilding()\"\n              data-aid=\"btn-buy-fortress-building\"\n              disabled.bind=\"!building.sufficientResources\"\n              title.bind=\"!building.sufficientResources ? 'Not enough resources' : 'Buy'\">Buy</button>\n    </li>\n  </ul>\n\n  <button class=\"construction-panel__close\"\n          click.trigger=\"closePanel()\">Close</button>\n</template>\n";});;
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('buildings/fortress-building',["require", "exports", "aurelia-framework", "lodash"], function (require, exports, aurelia_framework_1, lodash_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AllFortressBuildings = [
        "blacksmith_shop",
        "magician_tower",
        "bakery",
        "palisades",
        "bank"
    ];
    var FortressBuildingIcon;
    (function (FortressBuildingIcon) {
        FortressBuildingIcon["bakery"] = "dough-roller";
        FortressBuildingIcon["bank"] = "gold-stack";
        FortressBuildingIcon["blacksmith_shop"] = "anvil";
        FortressBuildingIcon["magician_tower"] = "evil-tower";
        FortressBuildingIcon["palisades"] = "palisade";
    })(FortressBuildingIcon = exports.FortressBuildingIcon || (exports.FortressBuildingIcon = {}));
    exports.FortressBuildingResourceCost = {
        bakery: {
            blood: 0,
            coal: 0,
            food: 10,
            gold: 10,
            iron: 0,
            mana: 0,
            stone: 10,
            wood: 10
        },
        bank: {
            blood: 0,
            coal: 0,
            food: 10,
            gold: 10,
            iron: 0,
            mana: 0,
            stone: 10,
            wood: 10
        },
        blacksmith_shop: {
            blood: 0,
            coal: 0,
            food: 10,
            gold: 10,
            iron: 0,
            mana: 0,
            stone: 10,
            wood: 10
        },
        magician_tower: {
            blood: 0,
            coal: 0,
            food: 10,
            gold: 10,
            iron: 0,
            mana: 0,
            stone: 10,
            wood: 10
        },
        palisades: {
            blood: 0,
            coal: 0,
            food: 10,
            gold: 10,
            iron: 0,
            mana: 0,
            stone: 10,
            wood: 10
        }
    };
    var FortressBuilding = (function () {
        function FortressBuilding() {
        }
        Object.defineProperty(FortressBuilding.prototype, "icon", {
            get: function () {
                return FortressBuildingIcon[this.type];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(FortressBuilding.prototype, "name", {
            get: function () {
                return lodash_1.capitalize(this.type.replace(/_/g, " "));
            },
            enumerable: true,
            configurable: true
        });
        __decorate([
            aurelia_framework_1.bindable(),
            __metadata("design:type", String)
        ], FortressBuilding.prototype, "type", void 0);
        __decorate([
            aurelia_framework_1.computedFrom("type"),
            __metadata("design:type", String),
            __metadata("design:paramtypes", [])
        ], FortressBuilding.prototype, "icon", null);
        __decorate([
            aurelia_framework_1.computedFrom("type"),
            __metadata("design:type", String),
            __metadata("design:paramtypes", [])
        ], FortressBuilding.prototype, "name", null);
        return FortressBuilding;
    }());
    exports.FortressBuilding = FortressBuilding;
});
;
define('text!buildings/fortress-building.html',[],function(){return "<template class=\"fortress-building\">\n  <img class=\"fortress-building__icon\"\n       title.bind=\"name\"\n       alt=\"A fortress building\"\n       src=\"assets/icons/${icon}.svg\" />\n</template>\n";});;
define('buildings/index',["require", "exports", "./construction-panel", "./fortress-building", "./purchase-panel", "./tile-building"], function (require, exports, construction_panel_1, fortress_building_1, purchase_panel_1, tile_building_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function configure(config) {
        config.globalResources([
            construction_panel_1.ConstructionPanel,
            fortress_building_1.FortressBuilding,
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
define('buildings/purchase-panel',["require", "exports", "aurelia-dialog", "aurelia-framework", "aurelia-store", "lodash", "../board/tile", "../resources/index", "../store/index", "./tile-building"], function (require, exports, aurelia_dialog_1, aurelia_framework_1, aurelia_store_1, lodash_1, tile_1, index_1, index_2, tile_building_1) {
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
            this.stats = model.stats;
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
        Object.defineProperty(PurchasePanel.prototype, "buildingName", {
            get: function () {
                return lodash_1.capitalize(tile_building_1.TileBuildingsMap[this.tile.type].replace(/_/g, " "));
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PurchasePanel.prototype, "soldiersLeft", {
            get: function () {
                return this.stats.soldiers > 0 && this.tileBuilding.garrison < tile_building_1.MAX_SOLDIERS;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PurchasePanel.prototype, "costs", {
            get: function () {
                var entries = Object.entries(tile_building_1.TileBuildingResourceCost[this.building]).filter(function (r) { return r[1] !== 0; });
                return entries.map(function (e) { return ({
                    icon: index_1.ResourcesIcons[e[0]],
                    resource: lodash_1.upperFirst(e[0]),
                    value: e[1],
                }); });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PurchasePanel.prototype, "sufficientResources", {
            get: function () {
                var _this = this;
                return !this.costs.some(function (c) { return _this.resources[c.resource.toLowerCase()] - c.value < 0; });
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
            newBuilding.garrison = 0;
            this.store.pipe(index_2.buyBuilding, newBuilding).pipe(index_2.closePurchasePanel).dispatch();
            this.controller.ok();
        };
        PurchasePanel.prototype.destroyBuilding = function () {
            this.store.pipe(index_2.destroyBuilding, this.tileBuilding.tileId).pipe(index_2.closePurchasePanel).dispatch();
            this.controller.ok();
        };
        PurchasePanel.prototype.reinforceBuilding = function () {
            this.store.pipe(index_2.reinforceTileBuilding, this.tileBuilding.tileId).pipe(index_2.closePurchasePanel).dispatch();
            this.controller.ok();
        };
        PurchasePanel.prototype.closePanel = function () {
            this.store.dispatch(index_2.closePurchasePanel);
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
            aurelia_framework_1.bindable(),
            __metadata("design:type", Object)
        ], PurchasePanel.prototype, "stats", void 0);
        __decorate([
            aurelia_framework_1.computedFrom("tile"),
            __metadata("design:type", Object),
            __metadata("design:paramtypes", [])
        ], PurchasePanel.prototype, "building", null);
        __decorate([
            aurelia_framework_1.computedFrom("tile"),
            __metadata("design:type", Object),
            __metadata("design:paramtypes", [])
        ], PurchasePanel.prototype, "buildingName", null);
        __decorate([
            aurelia_framework_1.computedFrom("stats.soldiers", "tileBuilding.garrison"),
            __metadata("design:type", Object),
            __metadata("design:paramtypes", [])
        ], PurchasePanel.prototype, "soldiersLeft", null);
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
define('text!buildings/purchase-panel.html',[],function(){return "<template class=\"purchase-panel\">\n  <div class=\"purchase-panel__top-bar\">\n    <h4 class=\"purchase-panel__header\">Building</h4>\n    <div class=\"purchase-panel__garrison\">\n      <img class=\"purchase-panel__stats-icon\"\n           src=\"assets/icons/sword-brandish.svg\"\n           alt=\"Garrisoned building\"\n           repeat.for=\"soldier of tileBuilding.garrison\" />\n    </div>\n  </div>\n  <ul class=\"purchase-panel__list\">\n    <li class=\"purchase-panel__item\">\n      <span class=\"purchase-panel__building-name\">\n        <img title.bind=\"buildingName\"\n             class=\"purchase-panel__building-icon\"\n             alt=\"A tile building\"\n             src=\"assets/icons/${buildingIcon}.svg\" />\n      </span>\n      <ul class=\"purchase-panel__cost cost\">\n        <li repeat.for=\"cost of costs\"\n            class=\"cost__item\">\n          <img src=\"assets/icons/${cost.icon}.svg\"\n               title.bind=\"cost.resource\"\n               alt.bind=\"cost.resource\"\n               class=\"cost__icon\" />\n          <span class=\"cost__value\">${cost.value}</span>\n        </li>\n      </ul>\n      <button class=\"purchase-panel__button\"\n              click.trigger=\"buyBuilding()\"\n              data-aid=\"btn-buy\"\n              disabled.bind=\"tileBuilding || !sufficientResources\"\n              title.bind=\"!sufficientResources ? 'Not enough resources' : 'Buy'\">Buy</button>\n      <button class=\"purchase-panel__button\"\n              click.trigger=\"destroyBuilding()\"\n              data-aid=\"btn-destroy\"\n              disabled.bind=\"!tileBuilding\"\n              title.bind=\"!tileBuilding ? 'Nothing built yet' : 'Destroy the building'\">Destroy</button>\n      <button class=\"purchase-panel__button\"\n              click.trigger=\"reinforceBuilding()\"\n              data-aid=\"btn-reinforce-building\"\n              disabled.bind=\"!tileBuilding || !soldiersLeft\"\n              title.bind=\"!tileBuilding ? 'Nothing built yet' : 'Reinforce with an additional soldier'\">Reinforce</button>\n\n    </li>\n  </ul>\n\n  <button class=\"purchase-panel__close\"\n          click.trigger=\"closePanel()\">Close</button>\n</template>\n";});;
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
    exports.BASE_DMG = 5;
    exports.DMG_PER_SOLDIER = 2;
    exports.MAX_SOLDIERS = 3;
    function calculateDmg(garrison) {
        return exports.BASE_DMG + ((garrison || 0) * exports.DMG_PER_SOLDIER);
    }
    exports.calculateDmg = calculateDmg;
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
        Object.defineProperty(TileBuilding.prototype, "dmg", {
            get: function () {
                return calculateDmg(this.garrison);
            },
            enumerable: true,
            configurable: true
        });
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
        __decorate([
            aurelia_framework_1.bindable,
            __metadata("design:type", Number)
        ], TileBuilding.prototype, "garrison", void 0);
        __decorate([
            aurelia_framework_1.computedFrom("garrison"),
            __metadata("design:type", Object),
            __metadata("design:paramtypes", [])
        ], TileBuilding.prototype, "dmg", null);
        return TileBuilding;
    }());
    exports.TileBuilding = TileBuilding;
});
;
define('text!buildings/tile-building.html',[],function(){return "<template class=\"${bem('tile-building', '', [placement])} au-animate\">\n  <div class=\"${bem('tile-building', 'display', [type, placement])}\"></div>\n</template>\n";});;
define('environment',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        debug: true,
        testing: true
    };
});
;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define('main',["require", "exports", "aurelia-store", "./environment", "./store/index", "web-animations-js"], function (require, exports, aurelia_store_1, environment_1, index_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    environment_1 = __importDefault(environment_1);
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("/enforted/sw.js", { scope: "." }).then(function (reg) {
            console.log("Successfully registered service worker. Scope is " + reg.scope);
        }).catch(function (error) {
            console.log("Failed registering service worker " + error);
        });
    }
    function configure(aurelia) {
        return __awaiter(this, void 0, void 0, function () {
            var storage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        aurelia.use
                            .standardConfiguration()
                            .plugin("aurelia-bem")
                            .plugin("aurelia-store", {
                            initialState: index_1.initialState
                        })
                            .plugin("aurelia-dialog")
                            .feature("board")
                            .feature("player")
                            .feature("monster")
                            .feature("sidebar")
                            .feature("buildings");
                        aurelia.use.developmentLogging(environment_1.default.debug ? "debug" : "warn");
                        if (!window.Cypress) {
                            aurelia.use.feature("animator", function (instance) {
                                instance.storedEnterAnimations["TILE-BUILDING"] = {
                                    keyframes: [
                                        { transform: "translate3d(0, 50%, 0)", opacity: "0" },
                                        { transform: "translate3d(0, 0, 0)", opacity: "1" }
                                    ],
                                    options: 300
                                };
                                instance.storedLeaveAnimations["TILE-BUILDING"] = {
                                    keyframes: [
                                        { transform: "translate3d(0, 0, 0)", opacity: "1" },
                                        { transform: "translate3d(0, 50%, 0)", opacity: "0" }
                                    ],
                                    options: 1000
                                };
                                instance.storedEnterAnimations.MONSTER = {
                                    keyframes: [
                                        { transform: "translate3d(0, 50%, 0)", opacity: "0" },
                                        { transform: "translate3d(0, 0, 0)", opacity: "1" }
                                    ],
                                    options: 300
                                };
                                instance.storedLeaveAnimations.MONSTER = {
                                    keyframes: [
                                        { transform: "translate3d(0, 0, 0)", opacity: "1" },
                                        { transform: "translate3d(0, 50%, 0)", opacity: "0" }
                                    ],
                                    options: 1000
                                };
                                return instance;
                            });
                        }
                        if (environment_1.default.testing) {
                            aurelia.use.plugin("aurelia-testing");
                        }
                        return [4, aurelia.start()];
                    case 1:
                        _a.sent();
                        storage = aurelia_store_1.rehydrateFromLocalStorage({}, index_1.LOCALSTORAGE_SAVE_KEY);
                        aurelia.setRoot(storage.gameStarted ? "./app" : "./start-screen");
                        return [2];
                }
            });
        });
    }
    exports.configure = configure;
});
;
define('text!main.css',[],function(){return "@import url(\"https://fonts.googleapis.com/css?family=MedievalSharp&display=swap\");\n/* stylelint-disable */\n/* General */\n/* Start screen */\n/* Tiles */\n/* Fortress */\n/* Player */\n/* Monster */\n/* Sidebar */\n/* Purchase panel */\n/* Buildings */\n/* stylelint-enable */\n.body {\n  background-color: #292927;\n  font-family: \"MedievalSharp\", cursive;\n  margin: 0;\n  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\n  user-select: none; }\n\nux-dialog-overlay.active {\n  background-color: #0f0f0e;\n  opacity: 0.5; }\n\n.app {\n  display: flex;\n  height: 100vh;\n  margin: 0 auto;\n  width: 100vw; }\n  .app__sidebar {\n    flex-grow: 1; }\n    .app__sidebar--visible {\n      display: flex; }\n    .app__sidebar--hidden {\n      display: none; }\n  .app__board {\n    flex-grow: 22; }\n  .app__toggle-sidebar {\n    background-color: #0f0f0e;\n    border: none;\n    color: #928573; }\n    .app__toggle-sidebar::-moz-focus-inner {\n      border: 0; }\n    .app__toggle-sidebar:focus {\n      outline: none; }\n    @media (min-width: 1281px) {\n      .app__toggle-sidebar {\n        display: none; } }\n  @media (min-width: 1281px) {\n    .app {\n      height: 50vw;\n      margin: 10px auto;\n      width: 80vw; } }\n\n.start-screen {\n  align-items: center;\n  color: #D4D7D9;\n  display: flex;\n  flex-direction: column;\n  height: 90vh;\n  justify-content: center;\n  margin: 0 auto;\n  width: 90vw; }\n  .start-screen__icon {\n    background-image: url(\"assets/favicon_maskable.png\");\n    background-size: contain;\n    border-radius: 15px;\n    box-shadow: 5px 3px 3px #0f0f0e;\n    cursor: pointer;\n    height: 20vh;\n    min-height: 200px;\n    min-width: 200px;\n    padding-top: 15px;\n    text-align: center;\n    width: 20vh; }\n  .start-screen__attributions {\n    margin-top: 15px; }\n  .start-screen__link:visited, .start-screen__link:link, .start-screen__link:active, .start-screen__link:hover {\n    color: #D4D7D9; }\n  .start-screen__name {\n    border: none;\n    font-family: \"MedievalSharp\", cursive;\n    padding: 3px 5px; }\n  .start-screen__github {\n    cursor: pointer;\n    position: relative;\n    top: 5px; }\n\n.tile {\n  align-items: center;\n  background-color: #0f0f0e;\n  background-repeat: no-repeat;\n  display: flex;\n  flex-grow: 1;\n  justify-content: center;\n  outline: 1px solid black;\n  position: relative; }\n  .tile--bottom {\n    background-position: bottom center;\n    background-size: 80%; }\n  .tile--top {\n    background-position: top center;\n    background-size: 80%; }\n  .tile--left {\n    background-position: left center; }\n  .tile--right {\n    background-position: right center; }\n  .tile--wood {\n    background-image: url(\"assets/icons/forest.svg\"); }\n  .tile--gold {\n    background-image: url(\"assets/icons/two-coins.svg\"); }\n  .tile--stone {\n    background-image: url(\"assets/icons/stone-block.svg\"); }\n  .tile--iron {\n    background-image: url(\"assets/icons/ore.svg\"); }\n  .tile--food {\n    background-image: url(\"assets/icons/wheat.svg\"); }\n  .tile--mana {\n    background-image: url(\"assets/icons/vortex.svg\"); }\n  .tile--coal {\n    background-image: url(\"assets/icons/brick-pile.svg\"); }\n  .tile--blood {\n    background-image: url(\"assets/icons/bloody-stash.svg\"); }\n  .tile--start {\n    background-image: url(\"assets/icons/direction-signs.svg\"); }\n  .tile--rally_point {\n    background-image: url(\"assets/icons/rally-the-troops.svg\"); }\n  .tile--tragedy {\n    background-image: url(\"assets/icons/tear-tracks.svg\"); }\n  .tile--sacred_grounds {\n    background-image: url(\"assets/icons/tumulus.svg\"); }\n  .tile--construction-site {\n    background-image: url(\"assets/icons/hand-saw.svg\"); }\n  .tile--fire_fountain {\n    background-image: url(\"assets/icons/fire-ring.svg\"); }\n  .tile--corner {\n    background-size: initial;\n    flex-direction: column;\n    flex-grow: 2;\n    outline: 1px solid black;\n    position: relative; }\n  .tile__text {\n    font-size: 14px;\n    font-weight: 500;\n    left: 0;\n    line-height: 1vw;\n    position: absolute;\n    right: 0;\n    text-align: center;\n    top: 12%; }\n  .tile__player {\n    top: 30%; }\n\n.board {\n  height: 100%; }\n  .board__row {\n    display: flex;\n    width: 100%; }\n    .board__row--top, .board__row--bottom {\n      height: 15.384615385%; }\n    .board__row--bottom {\n      flex-flow: row-reverse; }\n    .board__row--center {\n      height: 69.23076923%; }\n  .board__col {\n    outline: 1px solid black;\n    position: relative; }\n    .board__col--left, .board__col--right {\n      display: flex;\n      flex-direction: column;\n      flex-grow: 2; }\n    .board__col--left {\n      flex-flow: column-reverse; }\n    .board__col--center {\n      flex-basis: 0;\n      flex-grow: 9; }\n  .board__fortress {\n    outline: none; }\n\n.tragedy {\n  align-items: center;\n  display: flex;\n  flex-direction: column; }\n  .tragedy__image {\n    width: 150px; }\n  .tragedy__description {\n    text-align: justify;\n    text-justify: inter-word;\n    width: 400px; }\n\n.fortress {\n  align-items: center;\n  background-color: lightgray;\n  display: flex;\n  flex-direction: column;\n  height: 100%;\n  justify-content: center; }\n  .fortress__caption {\n    align-items: center;\n    display: flex;\n    flex: 8; }\n  .fortress__buildings {\n    align-items: center;\n    display: flex;\n    height: 25%;\n    justify-content: space-evenly;\n    width: 100%; }\n  .fortress__building {\n    height: 60%; }\n\n.game-over__header {\n  margin: 0; }\n\n.game-over__new-game {\n  margin-bottom: 15px; }\n\n.player {\n  align-items: center;\n  background-color: red;\n  border: 1px solid red;\n  border-radius: 50%;\n  display: flex;\n  font-size: 10px;\n  height: 4vw;\n  justify-content: center;\n  position: absolute;\n  width: 4vw;\n  z-index: 1; }\n\n.sidebar {\n  flex-direction: column; }\n  .sidebar__item {\n    align-items: center;\n    display: flex;\n    flex-direction: column;\n    justify-content: center; }\n  .sidebar__order-container {\n    display: flex;\n    flex-direction: row;\n    justify-content: center; }\n    @media (min-width: 1281px) {\n      .sidebar__order-container {\n        display: unset;\n        flex-direction: unset;\n        justify-content: unset; } }\n\n.save__button {\n  background-color: #3C4777;\n  border: 1px solid #0f0f0e;\n  border-radius: 3px;\n  color: white;\n  height: 30px;\n  margin: 10px 10px 0 10px;\n  width: calc(100% - 20px); }\n\n.dice__icon {\n  cursor: pointer;\n  height: 40px;\n  width: 40px; }\n\n.dice__round {\n  color: white;\n  font-size: 1em;\n  margin: 5px 0; }\n  @media (min-width: 1281px) {\n    .dice__round {\n      font-size: 1.5em; } }\n\n.dice__last-roll {\n  background-color: white;\n  font-size: 20px;\n  margin-top: 5px;\n  text-align: center;\n  width: 50px; }\n\n.tragedy-overview {\n  display: flex;\n  justify-content: center; }\n  .tragedy-overview__image {\n    width: 40px; }\n    @media (min-width: 1281px) {\n      .tragedy-overview__image {\n        width: 100px; } }\n    .tragedy-overview__image--hidden {\n      visibility: hidden; }\n\n.resources-overview__list {\n  color: white;\n  display: flex;\n  flex-direction: column;\n  flex-wrap: wrap;\n  height: 80px;\n  list-style: none;\n  padding: 0;\n  width: 90px; }\n  @media (min-width: 1281px) {\n    .resources-overview__list {\n      flex-wrap: unset;\n      height: unset;\n      width: 70px; } }\n\n.resources-overview__item {\n  align-items: center;\n  display: flex;\n  justify-content: space-between;\n  margin-right: 10px; }\n  @media (min-width: 1281px) {\n    .resources-overview__item {\n      margin-right: unset; } }\n\n.resources-overview__image {\n  width: 15px; }\n  @media (min-width: 1281px) {\n    .resources-overview__image {\n      width: 30px; } }\n\n.stats-overview__list {\n  color: white;\n  display: flex;\n  flex-direction: row;\n  list-style: none;\n  padding: 0;\n  width: 90px; }\n  @media (min-width: 1281px) {\n    .stats-overview__list {\n      flex-direction: column;\n      width: 70px; } }\n\n.stats-overview__item {\n  align-items: center;\n  display: flex;\n  justify-content: space-between;\n  margin-right: 5px; }\n  @media (min-width: 1281px) {\n    .stats-overview__item {\n      margin-right: unset; } }\n\n.stats-overview__image {\n  width: 15px; }\n  @media (min-width: 1281px) {\n    .stats-overview__image {\n      width: 30px; } }\n\n.build-overview {\n  display: flex;\n  justify-content: center; }\n  .build-overview__image {\n    width: 40px; }\n    @media (min-width: 1281px) {\n      .build-overview__image {\n        width: 100px; } }\n    .build-overview__image--hidden {\n      visibility: hidden; }\n\n.purchase-panel__top-bar {\n  display: flex;\n  justify-content: space-between; }\n\n.purchase-panel__stats-icon {\n  width: 1.3em; }\n\n.purchase-panel__list {\n  list-style: none;\n  padding: 0; }\n\n.purchase-panel__building-icon {\n  width: 70px; }\n\n.purchase-panel__building-name {\n  display: flex;\n  justify-content: center; }\n\n.purchase-panel__button {\n  margin-top: 10px; }\n\n.purchase-panel__cost {\n  list-style: none;\n  padding: 0 0 0 5px; }\n\n.purchase-panel__close {\n  margin-bottom: 15px; }\n\n.purchase-panel__header {\n  font-size: 1.3em;\n  margin: 0; }\n\n.cost__item {\n  align-items: center;\n  display: flex;\n  justify-content: space-between; }\n\n.cost__icon {\n  width: 30px; }\n\n.tile-building {\n  display: flex;\n  height: 100%;\n  width: 100%; }\n  .tile-building--bottom {\n    justify-content: center; }\n  .tile-building--top {\n    align-items: flex-end;\n    justify-content: center; }\n  .tile-building--left {\n    align-items: center;\n    justify-content: flex-end; }\n  .tile-building--right {\n    align-items: center;\n    justify-content: flex-start; }\n  .tile-building__display {\n    background-repeat: no-repeat; }\n    .tile-building__display--sawmill {\n      background-image: url(\"assets/icons/crosscut-saw.svg\"); }\n    .tile-building__display--iron_mine {\n      background-image: url(\"assets/icons/mining.svg\"); }\n    .tile-building__display--farm {\n      background-image: url(\"assets/icons/windmill.svg\"); }\n    .tile-building__display--quarry {\n      background-image: url(\"assets/icons/stone-crafting.svg\"); }\n    .tile-building__display--gold_mine {\n      background-image: url(\"assets/icons/gold-mine.svg\"); }\n    .tile-building__display--mana_rift {\n      background-image: url(\"assets/icons/magic-portal.svg\"); }\n    .tile-building__display--coal_mine {\n      background-image: url(\"assets/icons/coal-wagon.svg\"); }\n    .tile-building__display--butchery {\n      background-image: url(\"assets/icons/meat-cleaver.svg\"); }\n    .tile-building__display--shrine {\n      background-image: url(\"assets/icons/fire-shrine.svg\"); }\n    .tile-building__display--bottom {\n      margin-top: 10%;\n      width: 45%; }\n    .tile-building__display--top {\n      height: 30%;\n      margin-bottom: 10%;\n      width: 45%; }\n    .tile-building__display--left {\n      height: 60%;\n      margin-right: 5%;\n      width: 27%; }\n    .tile-building__display--right {\n      height: 60%;\n      margin-left: 5%;\n      width: 27%; }\n\n.construction-panel__list {\n  list-style: none;\n  padding: 0; }\n\n.construction-panel__message {\n  margin: 10px 0; }\n\n.construction-panel__building-icon {\n  margin: 0 10px;\n  width: 70px; }\n\n.construction-panel__building-navigator {\n  height: 30px; }\n\n.construction-panel__building-name {\n  align-items: center;\n  display: flex;\n  justify-content: center; }\n\n.construction-panel__buy {\n  margin-top: 10px; }\n\n.construction-panel__cost {\n  list-style: none;\n  padding: 0 0 0 5px; }\n\n.construction-panel__close {\n  margin-bottom: 15px; }\n\n.construction-panel__header {\n  margin: 0; }\n\n.fortress-building__icon {\n  height: 100%; }\n\n.monster {\n  align-items: center;\n  display: flex;\n  justify-content: center;\n  position: absolute;\n  z-index: 1; }\n  .monster:hover {\n    z-index: 2; }\n  .monster:only-of-type {\n    left: initial !important; }\n  .monster:nth-child(1) {\n    left: 0px; }\n  .monster:nth-child(2) {\n    left: 15px; }\n  .monster:nth-child(3) {\n    left: 30px; }\n  .monster:nth-child(4) {\n    left: 45px; }\n  .monster__icon {\n    height: 4vw;\n    width: 4vw; }\n  .monster__stats-container {\n    color: white;\n    position: absolute;\n    top: 73%;\n    width: 100%; }\n  .monster__stat {\n    border: 2px solid #3C4777;\n    border-radius: 30%;\n    font-size: 1.2vh;\n    height: 2vh;\n    line-height: 2vh;\n    text-align: center;\n    width: 2vh; }\n    .monster__stat--hp {\n      background-color: #3D5A1B;\n      float: left; }\n    .monster__stat--dmg {\n      background-color: black;\n      float: right; }\n\n/*# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5jc3MiLCJzb3VyY2VzIjpbIm1haW4uc2NzcyIsIi4uL3N0eWxlL19jb2xvcnMuc2NzcyIsIi4uL3N0eWxlL19oZWxwZXJzLnNjc3MiLCJfYXBwLnNjc3MiLCJfc3RhcnQtc2NyZWVuLnNjc3MiLCJib2FyZC9faW5kZXguc2NzcyIsImJvYXJkL190aWxlLnNjc3MiLCJib2FyZC9fYm9hcmQuc2NzcyIsImJvYXJkL190cmFnZWR5LnNjc3MiLCJib2FyZC9fZm9ydHJlc3Muc2NzcyIsImJvYXJkL19nYW1lLW92ZXIuc2NzcyIsInBsYXllci9fcGxheWVyLnNjc3MiLCJzaWRlYmFyL19pbmRleC5zY3NzIiwic2lkZWJhci9fZGljZS5zY3NzIiwic2lkZWJhci9fdHJhZ2VkeS1vdmVydmlldy5zY3NzIiwic2lkZWJhci9fcmVzb3VyY2VzLW92ZXJ2aWV3LnNjc3MiLCJzaWRlYmFyL19zdGF0cy1vdmVydmlldy5zY3NzIiwic2lkZWJhci9fYnVpbGQtb3ZlcnZpZXcuc2NzcyIsImJ1aWxkaW5ncy9faW5kZXguc2NzcyIsImJ1aWxkaW5ncy9fcHVyY2hhc2UtcGFuZWwuc2NzcyIsImJ1aWxkaW5ncy9fdGlsZS1idWlsZGluZy5zY3NzIiwiYnVpbGRpbmdzL19jb25zdHJ1Y3Rpb24tcGFuZWwuc2NzcyIsImJ1aWxkaW5ncy9fZm9ydHJlc3MtYnVpbGRpbmcuc2NzcyIsIm1vbnN0ZXIvX2luZGV4LnNjc3MiXSwic291cmNlc0NvbnRlbnQiOlsiQGltcG9ydCB1cmwoJ2h0dHBzOi8vZm9udHMuZ29vZ2xlYXBpcy5jb20vY3NzP2ZhbWlseT1NZWRpZXZhbFNoYXJwJmRpc3BsYXk9c3dhcCcpO1xuQGltcG9ydCBcIi4uL3N0eWxlL2NvbG9yc1wiO1xuQGltcG9ydCBcIi4uL3N0eWxlL2hlbHBlcnNcIjtcblxuJGRlZmF1bHRGb250OiAnTWVkaWV2YWxTaGFycCcsIGN1cnNpdmU7XG5cbi5ib2R5IHsgIFxuICBiYWNrZ3JvdW5kLWNvbG9yOiAkYm9keS1iZztcbiAgZm9udC1mYW1pbHk6ICRkZWZhdWx0Rm9udDtcbiAgbWFyZ2luOiAwO1xuICAtd2Via2l0LXRhcC1oaWdobGlnaHQtY29sb3I6IHJnYmEoMCwgMCwgMCwgMCk7XG4gIHVzZXItc2VsZWN0OiBub25lO1xufVxuXG4vLyBzdHlsZWxpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbnV4LWRpYWxvZy1vdmVybGF5LmFjdGl2ZSB7XG4gIGJhY2tncm91bmQtY29sb3I6ICRkaWFsb2ctb3ZlcmxheS1iZztcbiAgb3BhY2l0eTogMC41O1xufVxuXG5AaW1wb3J0IFwiLi9hcHBcIjtcbkBpbXBvcnQgXCIuL3N0YXJ0LXNjcmVlblwiO1xuQGltcG9ydCBcIi4vYm9hcmQvaW5kZXhcIjtcbkBpbXBvcnQgXCIuL3BsYXllci9wbGF5ZXJcIjtcbkBpbXBvcnQgXCIuL3NpZGViYXIvaW5kZXhcIjtcbkBpbXBvcnQgXCIuL2J1aWxkaW5ncy9pbmRleFwiO1xuQGltcG9ydCBcIi4vbW9uc3Rlci9pbmRleFwiO1xuIiwiLyogc3R5bGVsaW50LWRpc2FibGUgKi9cbiRncmFwaGl0ZTogIzJBMjcwODtcbiRzdG9uZXdhbGw6ICM5Mjg1NzM7XG4kYmVhdmVyOiAjODk2NTUyO1xuJGdvbGQ6ICNGRkQ3MDA7XG4kaXJvbjogI0Q0RDdEOTtcbiRjaGFyY29hbDogIzM2NDU0RjtcbiRibG9vZDogIzhhMDMwMztcbiRlYXN0YmF5OiAjM0M0Nzc3O1xuJGNvZC1ncmF5OiAjMGYwZjBlO1xuJHR1YXRhcmE6ICMyOTI5Mjc7XG4kY2xvdmVyOiAjM0Q1QTFCO1xuXG4vKiBHZW5lcmFsICovXG4kYm9keS1iZzogJHR1YXRhcmE7XG4kdG9nZ2xlLWNiYXItYnRuLWJnOiAkY29kLWdyYXk7XG4kdG9nZ2xlLWNiYXItYnRuLWZnOiAkc3RvbmV3YWxsO1xuJGRpYWxvZy1vdmVybGF5LWJnOiAkY29kLWdyYXk7XG5cbi8qIFN0YXJ0IHNjcmVlbiAqL1xuJHRleHQtZmc6ICRpcm9uO1xuXG4vKiBUaWxlcyAqL1xuJHRpbGUtYmc6ICRjb2QtZ3JheTtcbiR0aWxlLWJvcmRlci1iZzogYmxhY2s7XG4kdGlsZS1iZy0td29vZDogJGdyYXBoaXRlO1xuJHRpbGUtYmctLXN0b25lOiAkc3RvbmV3YWxsO1xuJHRpbGUtYmctLWlyb246ICRpcm9uO1xuJHRpbGUtYmctLWdvbGQ6ICRnb2xkO1xuJHRpbGUtYmctLWZvb2Q6ICRiZWF2ZXI7XG4kdGlsZS1iZy0tbWFuYTogJGVhc3RiYXk7XG4kdGlsZS1iZy0tY29hbDogJGNoYXJjb2FsO1xuJHRpbGUtYmctLWJsb29kOiAkYmxvb2Q7XG4kdGlsZS1iZy0tc3RhcnQ6IHdoaXRlO1xuXG5cbi8qIEZvcnRyZXNzICovXG4kZm9ydHJlc3MtYmc6IGxpZ2h0Z3JheTtcblxuLyogUGxheWVyICovXG4kcGxheWVyLWJnLWJvcmRlcjogcmVkO1xuXG4vKiBNb25zdGVyICovXG4kbW9uc3Rlci1zdGF0cy1jb2xvcjogd2hpdGU7XG4kbW9uc3Rlci1ocC1iZzogJGNsb3ZlcjtcbiRtb25zdGVyLWRtZy1iZzogYmxhY2s7XG4kbW9uc3Rlci1zdGF0LWJvcmRlcjogJGVhc3RiYXk7XG5cbi8qIFNpZGViYXIgKi9cbiRkaWNlLXRleHQtYmc6IHdoaXRlO1xuJHJlc291cmNlcy10ZXh0LWZnOiB3aGl0ZTtcbiRzYXZlLWJ1dHRvbi1iZzogJGVhc3RiYXk7XG4kc2F2ZS1idXR0b24tYm9yZGVyOiAkY29kLWdyYXk7XG4kc2F2ZS1idXR0b24tdGV4dDogd2hpdGU7XG5cbi8qIFB1cmNoYXNlIHBhbmVsICovXG4kcHVyY2hhc2UtcGFuZWwtYmc6IGJsYWNrO1xuXG4vKiBCdWlsZGluZ3MgKi9cbiRidWlsZGluZy1yYWRpYWwtYmc6ICR0dWF0YXJhO1xuJGJ1aWxkaW5nLWluZGljYXRvci1iZzogYmxhY2s7XG4vKiBzdHlsZWxpbnQtZW5hYmxlICovXG4iLCJAbWl4aW4gbXEtZGVza3RvcCB7XG4gIEBtZWRpYSAobWluLXdpZHRoOiAxMjgxcHgpIHtcbiAgICAgIEBjb250ZW50O1xuICB9XG59XG4iLCIuYXBwIHtcbiAgZGlzcGxheTogZmxleDtcbiAgaGVpZ2h0OiAxMDB2aDtcbiAgbWFyZ2luOiAwIGF1dG87XG4gIHdpZHRoOiAxMDB2dztcblxuICAmX19zaWRlYmFyIHtcbiAgICBmbGV4LWdyb3c6IDE7XG5cbiAgICAmLS12aXNpYmxlIHtcbiAgICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgfVxuXG4gICAgJi0taGlkZGVuIHtcbiAgICAgIGRpc3BsYXk6IG5vbmU7XG4gICAgfVxuICB9XG5cbiAgJl9fYm9hcmQge1xuICAgIGZsZXgtZ3JvdzogMjI7XG4gIH1cblxuICAmX190b2dnbGUtc2lkZWJhciB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogJHRvZ2dsZS1jYmFyLWJ0bi1iZztcbiAgICBib3JkZXI6IG5vbmU7XG4gICAgY29sb3I6ICR0b2dnbGUtY2Jhci1idG4tZmc7XG5cbiAgICAmOjotbW96LWZvY3VzLWlubmVyIHtcbiAgICAgIGJvcmRlcjogMDtcbiAgICB9XG4gICAgJjpmb2N1cyB7XG4gICAgICBvdXRsaW5lOiBub25lO1xuICAgIH1cblxuICAgIEBpbmNsdWRlIG1xLWRlc2t0b3Age1xuICAgICAgZGlzcGxheTogbm9uZTtcbiAgICB9XG4gIH1cblxuICBAaW5jbHVkZSBtcS1kZXNrdG9wIHtcbiAgICBoZWlnaHQ6IDUwdnc7XG4gICAgbWFyZ2luOiAxMHB4IGF1dG87XG4gICAgd2lkdGg6IDgwdnc7XG4gIH1cbn1cbiIsIi5zdGFydC1zY3JlZW4ge1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBjb2xvcjogJHRleHQtZmc7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIGhlaWdodDogOTB2aDtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIG1hcmdpbjogMCBhdXRvO1xuICB3aWR0aDogOTB2dztcblxuICAmX19pY29uIHtcbiAgICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoXCJhc3NldHMvZmF2aWNvbl9tYXNrYWJsZS5wbmdcIik7XG4gICAgYmFja2dyb3VuZC1zaXplOiBjb250YWluO1xuICAgIGJvcmRlci1yYWRpdXM6IDE1cHg7XG4gICAgYm94LXNoYWRvdzogNXB4IDNweCAzcHggJGNvZC1ncmF5O1xuICAgIGN1cnNvcjogcG9pbnRlcjtcbiAgICBoZWlnaHQ6IDIwdmg7XG4gICAgbWluLWhlaWdodDogMjAwcHg7XG4gICAgbWluLXdpZHRoOiAyMDBweDtcbiAgICBwYWRkaW5nLXRvcDogMTVweDtcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gICAgd2lkdGg6IDIwdmg7XG4gIH1cblxuICAmX19hdHRyaWJ1dGlvbnMge1xuICAgIG1hcmdpbi10b3A6IDE1cHg7XG4gIH1cbiAgXG4gICZfX2xpbmsge1xuICAgICY6dmlzaXRlZCxcbiAgICAmOmxpbmssXG4gICAgJjphY3RpdmUsXG4gICAgJjpob3ZlciB7XG4gICAgICBjb2xvcjogJHRleHQtZmc7XG4gICAgfVxuICB9XG5cbiAgJl9fbmFtZSB7XG4gICAgYm9yZGVyOiBub25lO1xuICAgIGZvbnQtZmFtaWx5OiAkZGVmYXVsdEZvbnQ7XG4gICAgcGFkZGluZzogM3B4IDVweDtcbiAgfVxuXG4gICZfX2dpdGh1YiB7XG4gICAgY3Vyc29yOiBwb2ludGVyO1xuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICB0b3A6IDVweDtcbiAgfVxufVxuIiwiQGltcG9ydCBcIi4vdGlsZVwiO1xuQGltcG9ydCBcIi4vYm9hcmRcIjtcbkBpbXBvcnQgXCIuL3RyYWdlZHlcIjtcbkBpbXBvcnQgXCIuL2ZvcnRyZXNzXCI7XG5AaW1wb3J0IFwiLi9nYW1lLW92ZXJcIjtcbiIsIi50aWxlIHtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgYmFja2dyb3VuZC1jb2xvcjogJHRpbGUtYmc7XG4gIGJhY2tncm91bmQtcmVwZWF0OiBuby1yZXBlYXQ7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZ3JvdzogMTtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIG91dGxpbmU6IDFweCBzb2xpZCAkdGlsZS1ib3JkZXItYmc7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcblxuICAmLS1ib3R0b20ge1xuICAgIGJhY2tncm91bmQtcG9zaXRpb246IGJvdHRvbSBjZW50ZXI7XG4gICAgYmFja2dyb3VuZC1zaXplOiA4MCU7XG4gIH1cblxuICAmLS10b3Age1xuICAgIGJhY2tncm91bmQtcG9zaXRpb246IHRvcCBjZW50ZXI7XG4gICAgYmFja2dyb3VuZC1zaXplOiA4MCU7XG4gIH1cblxuICAmLS1sZWZ0IHtcbiAgICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiBsZWZ0IGNlbnRlcjtcbiAgfVxuXG4gICYtLXJpZ2h0IHtcbiAgICBiYWNrZ3JvdW5kLXBvc2l0aW9uOiByaWdodCBjZW50ZXI7XG4gIH1cblxuICAmLS13b29kIHtcbiAgICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoXCJhc3NldHMvaWNvbnMvZm9yZXN0LnN2Z1wiKTtcbiAgfVxuXG4gICYtLWdvbGQge1xuICAgIGJhY2tncm91bmQtaW1hZ2U6IHVybChcImFzc2V0cy9pY29ucy90d28tY29pbnMuc3ZnXCIpO1xuICB9XG5cbiAgJi0tc3RvbmUge1xuICAgIGJhY2tncm91bmQtaW1hZ2U6IHVybChcImFzc2V0cy9pY29ucy9zdG9uZS1ibG9jay5zdmdcIik7XG4gIH1cblxuICAmLS1pcm9uIHtcbiAgICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoXCJhc3NldHMvaWNvbnMvb3JlLnN2Z1wiKTtcbiAgfVxuXG4gICYtLWZvb2Qge1xuICAgIGJhY2tncm91bmQtaW1hZ2U6IHVybChcImFzc2V0cy9pY29ucy93aGVhdC5zdmdcIik7XG4gIH1cblxuICAmLS1tYW5hIHtcbiAgICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoXCJhc3NldHMvaWNvbnMvdm9ydGV4LnN2Z1wiKTtcbiAgfVxuXG4gICYtLWNvYWwge1xuICAgIGJhY2tncm91bmQtaW1hZ2U6IHVybChcImFzc2V0cy9pY29ucy9icmljay1waWxlLnN2Z1wiKTtcbiAgfVxuXG4gICYtLWJsb29kIHtcbiAgICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoXCJhc3NldHMvaWNvbnMvYmxvb2R5LXN0YXNoLnN2Z1wiKTtcbiAgfVxuXG4gICYtLXN0YXJ0IHtcbiAgICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoXCJhc3NldHMvaWNvbnMvZGlyZWN0aW9uLXNpZ25zLnN2Z1wiKTtcbiAgfVxuXG4gICYtLXJhbGx5X3BvaW50IHtcbiAgICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoXCJhc3NldHMvaWNvbnMvcmFsbHktdGhlLXRyb29wcy5zdmdcIik7XG4gIH1cblxuICAmLS10cmFnZWR5IHtcbiAgICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoXCJhc3NldHMvaWNvbnMvdGVhci10cmFja3Muc3ZnXCIpO1xuICB9XG5cbiAgJi0tc2FjcmVkX2dyb3VuZHMge1xuICAgIGJhY2tncm91bmQtaW1hZ2U6IHVybChcImFzc2V0cy9pY29ucy90dW11bHVzLnN2Z1wiKTtcbiAgfVxuXG4gICYtLWNvbnN0cnVjdGlvbi1zaXRlIHtcbiAgICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoXCJhc3NldHMvaWNvbnMvaGFuZC1zYXcuc3ZnXCIpO1xuICB9XG5cbiAgJi0tZmlyZV9mb3VudGFpbiB7XG4gICAgYmFja2dyb3VuZC1pbWFnZTogdXJsKFwiYXNzZXRzL2ljb25zL2ZpcmUtcmluZy5zdmdcIik7XG4gIH1cblxuICAmLS1jb3JuZXIge1xuICAgIGJhY2tncm91bmQtc2l6ZTogaW5pdGlhbDtcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgIGZsZXgtZ3JvdzogMjtcbiAgICBvdXRsaW5lOiAxcHggc29saWQgJHRpbGUtYm9yZGVyLWJnO1xuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgfVxuXG4gICZfX3RleHQge1xuICAgIGZvbnQtc2l6ZTogMTRweDtcbiAgICBmb250LXdlaWdodDogNTAwO1xuICAgIGxlZnQ6IDA7XG4gICAgbGluZS1oZWlnaHQ6IDF2dztcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgcmlnaHQ6IDA7XG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgIHRvcDogMTIlO1xuICB9XG5cbiAgJl9fcGxheWVyIHtcbiAgICB0b3A6IDMwJTtcbiAgfVxufVxuIiwiLmJvYXJkIHtcbiAgaGVpZ2h0OiAxMDAlO1xuXG4gICZfX3JvdyB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICB3aWR0aDogMTAwJTtcblxuICAgICYtLXRvcCxcbiAgICAmLS1ib3R0b20ge1xuICAgICAgaGVpZ2h0OiAxNS4zODQ2MTUzODUlO1xuICAgIH1cblxuICAgICYtLWJvdHRvbSB7XG4gICAgICBmbGV4LWZsb3c6IHJvdy1yZXZlcnNlO1xuICAgIH1cblxuICAgICYtLWNlbnRlciB7XG4gICAgICBoZWlnaHQ6IDY5LjIzMDc2OTIzJTtcbiAgICB9XG4gIH1cblxuICAmX19jb2wge1xuICAgIG91dGxpbmU6IDFweCBzb2xpZCAkdGlsZS1ib3JkZXItYmc7XG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xuXG4gICAgJi0tbGVmdCxcbiAgICAmLS1yaWdodCB7XG4gICAgICBkaXNwbGF5OiBmbGV4O1xuICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICAgIGZsZXgtZ3JvdzogMjtcbiAgICB9XG5cbiAgICAmLS1sZWZ0IHtcbiAgICAgIGZsZXgtZmxvdzogY29sdW1uLXJldmVyc2U7XG4gICAgfVxuXG4gICAgJi0tY2VudGVyIHtcbiAgICAgIGZsZXgtYmFzaXM6IDA7XG4gICAgICBmbGV4LWdyb3c6IDk7XG4gICAgfVxuICB9XG5cbiAgJl9fZm9ydHJlc3Mge1xuICAgIG91dGxpbmU6IG5vbmU7XG4gIH1cbn1cbiIsIi50cmFnZWR5IHtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcblxuICAmX19pbWFnZSB7XG4gICAgd2lkdGg6IDE1MHB4O1xuICB9XG5cbiAgJl9fZGVzY3JpcHRpb24ge1xuICAgIHRleHQtYWxpZ246IGp1c3RpZnk7XG4gICAgdGV4dC1qdXN0aWZ5OiBpbnRlci13b3JkO1xuICAgIHdpZHRoOiA0MDBweDtcbiAgfVxufVxuIiwiLmZvcnRyZXNzIHtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgYmFja2dyb3VuZC1jb2xvcjogJGZvcnRyZXNzLWJnO1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBoZWlnaHQ6IDEwMCU7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuXG4gICZfX2NhcHRpb24ge1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmbGV4OiA4O1xuICB9XG5cbiAgJl9fYnVpbGRpbmdzIHtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgaGVpZ2h0OiAyNSU7XG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1ldmVubHk7XG4gICAgd2lkdGg6IDEwMCU7XG4gIH1cblxuICAmX19idWlsZGluZyB7XG4gICAgaGVpZ2h0OiA2MCU7XG4gIH1cbn1cbiIsIi5nYW1lLW92ZXIge1xuICAmX19oZWFkZXIge1xuICAgIG1hcmdpbjogMDtcbiAgfVxuXG4gICZfX25ldy1nYW1lIHtcbiAgICBtYXJnaW4tYm90dG9tOiAxNXB4O1xuICB9XG59XG4iLCIucGxheWVyIHtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgYmFja2dyb3VuZC1jb2xvcjogJHBsYXllci1iZy1ib3JkZXI7XG4gIGJvcmRlcjogMXB4IHNvbGlkICRwbGF5ZXItYmctYm9yZGVyO1xuICBib3JkZXItcmFkaXVzOiA1MCU7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZvbnQtc2l6ZTogMTBweDtcbiAgaGVpZ2h0OiA0dnc7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHdpZHRoOiA0dnc7XG4gIHotaW5kZXg6IDE7XG59XG4iLCIuc2lkZWJhciB7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG5cbiAgJl9faXRlbSB7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIH1cblxuICAmX19vcmRlci1jb250YWluZXIge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZmxleC1kaXJlY3Rpb246IHJvdztcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcblxuICAgIEBpbmNsdWRlIG1xLWRlc2t0b3Age1xuICAgICAgZGlzcGxheTogdW5zZXQ7XG4gICAgICBmbGV4LWRpcmVjdGlvbjogdW5zZXQ7XG4gICAgICBqdXN0aWZ5LWNvbnRlbnQ6IHVuc2V0O1xuICAgIH1cbiAgfVxufVxuXG4uc2F2ZSB7XG4gICZfX2J1dHRvbiB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogJHNhdmUtYnV0dG9uLWJnO1xuICAgIGJvcmRlcjogMXB4IHNvbGlkICRzYXZlLWJ1dHRvbi1ib3JkZXI7XG4gICAgYm9yZGVyLXJhZGl1czogM3B4O1xuICAgIGNvbG9yOiAkc2F2ZS1idXR0b24tdGV4dDtcbiAgICBoZWlnaHQ6IDMwcHg7XG4gICAgbWFyZ2luOiAxMHB4IDEwcHggMCAxMHB4O1xuICAgIHdpZHRoOiBjYWxjKDEwMCUgLSAyMHB4KTtcbiAgfVxufVxuXG5AaW1wb3J0IFwiLi9kaWNlXCI7XG5AaW1wb3J0IFwiLi90cmFnZWR5LW92ZXJ2aWV3XCI7XG5AaW1wb3J0IFwiLi9yZXNvdXJjZXMtb3ZlcnZpZXdcIjtcbkBpbXBvcnQgXCIuL3N0YXRzLW92ZXJ2aWV3XCI7XG5AaW1wb3J0IFwiLi9idWlsZC1vdmVydmlld1wiO1xuIiwiLmRpY2Uge1xuICAmX19pY29uIHtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgaGVpZ2h0OiA0MHB4O1xuICAgIHdpZHRoOiA0MHB4O1xuICB9XG5cbiAgJl9fcm91bmQge1xuICAgIGNvbG9yOiAkcmVzb3VyY2VzLXRleHQtZmc7XG4gICAgZm9udC1zaXplOiAxZW07XG4gICAgbWFyZ2luOiA1cHggMDtcblxuICAgIEBpbmNsdWRlIG1xLWRlc2t0b3Age1xuICAgICAgZm9udC1zaXplOiAxLjVlbTsgICAgICBcbiAgICB9XG4gIH1cbiAgXG4gICZfX2xhc3Qtcm9sbCB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogJGRpY2UtdGV4dC1iZztcbiAgICBmb250LXNpemU6IDIwcHg7XG4gICAgbWFyZ2luLXRvcDogNXB4O1xuICAgIHRleHQtYWxpZ246IGNlbnRlcjtcbiAgICB3aWR0aDogNTBweDtcbiAgfVxufVxuIiwiLnRyYWdlZHktb3ZlcnZpZXcge1xuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcblxuICAmX19pbWFnZSB7XG4gICAgd2lkdGg6IDQwcHg7XG5cbiAgICBAaW5jbHVkZSBtcS1kZXNrdG9wIHtcbiAgICAgIHdpZHRoOiAxMDBweDtcbiAgICB9XG5cbiAgICAmLS1oaWRkZW4ge1xuICAgICAgdmlzaWJpbGl0eTogaGlkZGVuO1xuICAgIH1cbiAgfVxufVxuIiwiLnJlc291cmNlcy1vdmVydmlldyB7XG4gICZfX2xpc3Qge1xuICAgIGNvbG9yOiAkcmVzb3VyY2VzLXRleHQtZmc7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgIGZsZXgtd3JhcDogd3JhcDtcbiAgICBoZWlnaHQ6IDgwcHg7XG4gICAgbGlzdC1zdHlsZTogbm9uZTtcbiAgICBwYWRkaW5nOiAwO1xuICAgIHdpZHRoOiA5MHB4O1xuXG4gICAgQGluY2x1ZGUgbXEtZGVza3RvcCB7XG4gICAgICBmbGV4LXdyYXA6IHVuc2V0O1xuICAgICAgaGVpZ2h0OiB1bnNldDtcbiAgICAgIHdpZHRoOiA3MHB4O1xuICAgIH1cbiAgfVxuXG4gICZfX2l0ZW0ge1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gICAgbWFyZ2luLXJpZ2h0OiAxMHB4O1xuXG4gICAgQGluY2x1ZGUgbXEtZGVza3RvcCB7XG4gICAgICBtYXJnaW4tcmlnaHQ6IHVuc2V0O1xuICAgIH1cbiAgfVxuXG4gICZfX2ltYWdlIHtcbiAgICB3aWR0aDogMTVweDtcbiAgICBAaW5jbHVkZSBtcS1kZXNrdG9wIHtcbiAgICAgIHdpZHRoOiAzMHB4O1xuICAgIH1cbiAgfVxufVxuIiwiLnN0YXRzLW92ZXJ2aWV3IHtcbiAgJl9fbGlzdCB7XG4gICAgY29sb3I6ICRyZXNvdXJjZXMtdGV4dC1mZztcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZsZXgtZGlyZWN0aW9uOiByb3c7XG4gICAgbGlzdC1zdHlsZTogbm9uZTtcbiAgICBwYWRkaW5nOiAwO1xuICAgIHdpZHRoOiA5MHB4O1xuXG4gICAgQGluY2x1ZGUgbXEtZGVza3RvcCB7XG4gICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgICAgd2lkdGg6IDcwcHg7XG4gICAgfVxuICB9XG5cbiAgJl9faXRlbSB7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcbiAgICBtYXJnaW4tcmlnaHQ6IDVweDtcblxuICAgIEBpbmNsdWRlIG1xLWRlc2t0b3Age1xuICAgICAgbWFyZ2luLXJpZ2h0OiB1bnNldDtcbiAgICB9XG4gIH1cblxuICAmX19pbWFnZSB7XG4gICAgd2lkdGg6IDE1cHg7XG5cbiAgICBAaW5jbHVkZSBtcS1kZXNrdG9wIHtcbiAgICAgIHdpZHRoOiAzMHB4O1xuICAgIH1cbiAgfVxufVxuIiwiLmJ1aWxkLW92ZXJ2aWV3IHtcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG5cbiAgJl9faW1hZ2Uge1xuICAgIHdpZHRoOiA0MHB4O1xuXG4gICAgQGluY2x1ZGUgbXEtZGVza3RvcCB7XG4gICAgICB3aWR0aDogMTAwcHg7XG4gICAgfVxuXG4gICAgJi0taGlkZGVuIHtcbiAgICAgIHZpc2liaWxpdHk6IGhpZGRlbjtcbiAgICB9XG4gIH1cbn1cbiIsIkBpbXBvcnQgXCIuL3B1cmNoYXNlLXBhbmVsXCI7XG5AaW1wb3J0IFwiLi90aWxlLWJ1aWxkaW5nXCI7XG5AaW1wb3J0IFwiLi9jb25zdHJ1Y3Rpb24tcGFuZWxcIjtcbkBpbXBvcnQgXCIuL2ZvcnRyZXNzLWJ1aWxkaW5nXCI7XG4iLCIkdG9wQmFySGVpZ2h0OiAxLjNlbTtcblxuLnB1cmNoYXNlLXBhbmVsIHtcbiAgJl9fdG9wLWJhciB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gIH1cblxuICAmX19zdGF0cy1pY29uIHtcbiAgICB3aWR0aDogJHRvcEJhckhlaWdodDtcbiAgfVxuXG4gICZfX2xpc3Qge1xuICAgIGxpc3Qtc3R5bGU6IG5vbmU7XG4gICAgcGFkZGluZzogMDtcbiAgfVxuXG4gICZfX2J1aWxkaW5nLWljb24ge1xuICAgIHdpZHRoOiA3MHB4O1xuICB9XG5cbiAgJl9fYnVpbGRpbmctbmFtZSB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgfVxuXG4gICZfX2J1dHRvbiB7XG4gICAgbWFyZ2luLXRvcDogMTBweDtcbiAgfVxuXG4gICZfX2Nvc3Qge1xuICAgIGxpc3Qtc3R5bGU6IG5vbmU7XG4gICAgcGFkZGluZzogMCAwIDAgNXB4O1xuICB9XG5cbiAgJl9fY2xvc2Uge1xuICAgIG1hcmdpbi1ib3R0b206IDE1cHg7XG4gIH1cblxuICAmX19oZWFkZXIge1xuICAgIGZvbnQtc2l6ZTogJHRvcEJhckhlaWdodDtcbiAgICBtYXJnaW46IDA7XG4gIH1cbn1cblxuLmNvc3Qge1xuICAmX19pdGVtIHtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICB9XG5cbiAgJl9faWNvbiB7XG4gICAgd2lkdGg6IDMwcHg7XG4gIH1cbn1cbiIsIi50aWxlLWJ1aWxkaW5nIHtcbiAgZGlzcGxheTogZmxleDtcbiAgaGVpZ2h0OiAxMDAlO1xuICB3aWR0aDogMTAwJTtcblxuICAmLS1ib3R0b20ge1xuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICB9XG5cbiAgJi0tdG9wIHtcbiAgICBhbGlnbi1pdGVtczogZmxleC1lbmQ7XG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIH1cblxuICAmLS1sZWZ0IHtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGp1c3RpZnktY29udGVudDogZmxleC1lbmQ7XG4gIH1cblxuICAmLS1yaWdodCB7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGZsZXgtc3RhcnQ7XG4gIH1cblxuICAmX19kaXNwbGF5IHtcbiAgICBiYWNrZ3JvdW5kLXJlcGVhdDogbm8tcmVwZWF0O1xuXG4gICAgJi0tc2F3bWlsbCB7XG4gICAgICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoXCJhc3NldHMvaWNvbnMvY3Jvc3NjdXQtc2F3LnN2Z1wiKTtcbiAgICB9XG5cbiAgICAmLS1pcm9uX21pbmUge1xuICAgICAgYmFja2dyb3VuZC1pbWFnZTogdXJsKFwiYXNzZXRzL2ljb25zL21pbmluZy5zdmdcIik7XG4gICAgfVxuXG4gICAgJi0tZmFybSB7XG4gICAgICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoXCJhc3NldHMvaWNvbnMvd2luZG1pbGwuc3ZnXCIpO1xuICAgIH1cblxuICAgICYtLXF1YXJyeSB7XG4gICAgICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoXCJhc3NldHMvaWNvbnMvc3RvbmUtY3JhZnRpbmcuc3ZnXCIpO1xuICAgIH1cblxuICAgICYtLWdvbGRfbWluZSB7XG4gICAgICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoXCJhc3NldHMvaWNvbnMvZ29sZC1taW5lLnN2Z1wiKTtcbiAgICB9XG5cbiAgICAmLS1tYW5hX3JpZnQge1xuICAgICAgYmFja2dyb3VuZC1pbWFnZTogdXJsKFwiYXNzZXRzL2ljb25zL21hZ2ljLXBvcnRhbC5zdmdcIik7XG4gICAgfVxuXG4gICAgJi0tY29hbF9taW5lIHtcbiAgICAgIGJhY2tncm91bmQtaW1hZ2U6IHVybChcImFzc2V0cy9pY29ucy9jb2FsLXdhZ29uLnN2Z1wiKTtcbiAgICB9XG5cbiAgICAmLS1idXRjaGVyeSB7XG4gICAgICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoXCJhc3NldHMvaWNvbnMvbWVhdC1jbGVhdmVyLnN2Z1wiKTtcbiAgICB9XG5cbiAgICAmLS1zaHJpbmUge1xuICAgICAgYmFja2dyb3VuZC1pbWFnZTogdXJsKFwiYXNzZXRzL2ljb25zL2ZpcmUtc2hyaW5lLnN2Z1wiKTtcbiAgICB9XG5cbiAgICAmLS1ib3R0b20ge1xuICAgICAgbWFyZ2luLXRvcDogMTAlO1xuICAgICAgd2lkdGg6IDQ1JTtcbiAgICB9XG5cbiAgICAmLS10b3Age1xuICAgICAgaGVpZ2h0OiAzMCU7XG4gICAgICBtYXJnaW4tYm90dG9tOiAxMCU7XG4gICAgICB3aWR0aDogNDUlO1xuICAgIH1cblxuICAgICYtLWxlZnQge1xuICAgICAgaGVpZ2h0OiA2MCU7XG4gICAgICBtYXJnaW4tcmlnaHQ6IDUlO1xuICAgICAgd2lkdGg6IDI3JTtcbiAgICB9XG5cbiAgICAmLS1yaWdodCB7XG4gICAgICBoZWlnaHQ6IDYwJTtcbiAgICAgIG1hcmdpbi1sZWZ0OiA1JTtcbiAgICAgIHdpZHRoOiAyNyU7XG4gICAgfVxuICB9XG59XG4iLCIuY29uc3RydWN0aW9uLXBhbmVsIHtcbiAgJl9fbGlzdCB7XG4gICAgbGlzdC1zdHlsZTogbm9uZTtcbiAgICBwYWRkaW5nOiAwO1xuICB9XG5cbiAgJl9fbWVzc2FnZSB7XG4gICAgbWFyZ2luOiAxMHB4IDA7XG4gIH1cblxuICAmX19idWlsZGluZy1pY29uIHtcbiAgICBtYXJnaW46IDAgMTBweDtcbiAgICB3aWR0aDogNzBweDtcbiAgfVxuXG4gICZfX2J1aWxkaW5nLW5hdmlnYXRvciB7XG4gICAgaGVpZ2h0OiAzMHB4O1xuICB9XG5cbiAgJl9fYnVpbGRpbmctbmFtZSB7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICB9XG5cbiAgJl9fYnV5IHtcbiAgICBtYXJnaW4tdG9wOiAxMHB4O1xuICB9XG5cbiAgJl9fY29zdCB7XG4gICAgbGlzdC1zdHlsZTogbm9uZTtcbiAgICBwYWRkaW5nOiAwIDAgMCA1cHg7XG4gIH1cblxuICAmX19jbG9zZSB7XG4gICAgbWFyZ2luLWJvdHRvbTogMTVweDtcbiAgfVxuXG4gICZfX2hlYWRlciB7XG4gICAgbWFyZ2luOiAwO1xuICB9XG59XG4iLCIuZm9ydHJlc3MtYnVpbGRpbmcge1xuICAmX19pY29uIHtcbiAgICBoZWlnaHQ6IDEwMCU7XG4gIH1cbn1cbiIsIi5tb25zdGVyIHtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgei1pbmRleDogMTtcblxuICAmOmhvdmVyIHtcbiAgICB6LWluZGV4OiAyO1xuICB9XG5cbiAgLy8gc3R5bGVsaW50LWRpc2FibGUgc2VsZWN0b3ItbWF4LXNwZWNpZmljaXR5XG4gICY6b25seS1vZi10eXBlIHtcbiAgICAvLyBzdHlsZWxpbnQtZGlzYWJsZS1uZXh0LWxpbmUgZGVjbGFyYXRpb24tbm8taW1wb3J0YW50XG4gICAgbGVmdDogaW5pdGlhbCFpbXBvcnRhbnQ7XG4gIH1cbiAgQGZvciAkaSBmcm9tIDEgdGhyb3VnaCA0IHtcbiAgICAmOm50aC1jaGlsZCgjeyRpfSkge1xuICAgICAgbGVmdDogI3soJGkgLSAxKSAqIDE1fXB4O1xuICAgIH1cbiAgfVxuICAvLyBzdHlsZWxpbnQtZW5hYmxlXG5cbiAgJl9faWNvbiB7XG4gICAgaGVpZ2h0OiA0dnc7XG4gICAgd2lkdGg6IDR2dztcbiAgfVxuXG4gICZfX3N0YXRzLWNvbnRhaW5lciB7XG4gICAgY29sb3I6ICRtb25zdGVyLXN0YXRzLWNvbG9yO1xuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICB0b3A6IDczJTtcbiAgICB3aWR0aDogMTAwJTtcbiAgfVxuXG4gICZfX3N0YXQge1xuICAgIGJvcmRlcjogMnB4IHNvbGlkICRtb25zdGVyLXN0YXQtYm9yZGVyO1xuICAgIGJvcmRlci1yYWRpdXM6IDMwJTtcbiAgICBmb250LXNpemU6IDEuMnZoO1xuICAgIGhlaWdodDogMnZoO1xuICAgIGxpbmUtaGVpZ2h0OiAydmg7XG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xuICAgIHdpZHRoOiAydmg7XG5cbiAgICAmLS1ocCB7XG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkbW9uc3Rlci1ocC1iZztcbiAgICAgIGZsb2F0OiBsZWZ0O1xuICAgIH1cblxuICAgICYtLWRtZyB7XG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiAkbW9uc3Rlci1kbWctYmc7XG4gICAgICBmbG9hdDogcmlnaHQ7XG4gICAgfVxuICB9XG59XG4iXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxDQUFDLHlFQUFJO0FDQVosdUJBQXVCO0FBYXZCLGFBQWE7QUFNYixrQkFBa0I7QUFHbEIsV0FBVztBQWNYLGNBQWM7QUFHZCxZQUFZO0FBR1osYUFBYTtBQU1iLGFBQWE7QUFPYixvQkFBb0I7QUFHcEIsZUFBZTtBQUdmLHNCQUFzQjtBRHZEdEIsQUFBQSxLQUFLLENBQUM7RUFDSixnQkFBZ0IsRUNHUixPQUFPO0VERmYsV0FBVyxFQUpDLGVBQWUsRUFBRSxPQUFPO0VBS3BDLE1BQU0sRUFBRSxDQUFDO0VBQ1QsMkJBQTJCLEVBQUUsZ0JBQWdCO0VBQzdDLFdBQVcsRUFBRSxJQUFJLEdBQ2xCOztBQUdELEFBQUEsaUJBQWlCLEFBQUEsT0FBTyxDQUFD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 */\n";});;
define('monster/index',["require", "exports", "./monster"], function (require, exports, monster_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function configure(config) {
        config.globalResources([
            monster_1.Monster
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
define('monster/monster',["require", "exports", "aurelia-framework"], function (require, exports, aurelia_framework_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Monster = (function () {
        function Monster() {
        }
        Object.defineProperty(Monster.prototype, "icon", {
            get: function () {
                return exports.MonsterPropMap[this.type].icon;
            },
            enumerable: true,
            configurable: true
        });
        __decorate([
            aurelia_framework_1.bindable,
            __metadata("design:type", String)
        ], Monster.prototype, "currentTileId", void 0);
        __decorate([
            aurelia_framework_1.bindable,
            __metadata("design:type", String)
        ], Monster.prototype, "type", void 0);
        __decorate([
            aurelia_framework_1.bindable,
            __metadata("design:type", Object)
        ], Monster.prototype, "stats", void 0);
        __decorate([
            aurelia_framework_1.computedFrom("type"),
            __metadata("design:type", String),
            __metadata("design:paramtypes", [])
        ], Monster.prototype, "icon", null);
        return Monster;
    }());
    exports.Monster = Monster;
    exports.AllMonsters = [
        "Zombie",
        "Skeleton",
        "Golem",
        "Dragon"
    ];
    exports.MonsterPropMap = {
        Dragon: {
            icon: "spiked-dragon-head",
            stats: { hp: 30, dmg: 10 }
        },
        Golem: {
            icon: "rock-golem",
            stats: { hp: 35, dmg: 5 }
        },
        Skeleton: {
            icon: "harry-potter-skull",
            stats: { hp: 13, dmg: 4 }
        },
        Zombie: {
            icon: "half-body-crawling",
            stats: { hp: 10, dmg: 2 }
        },
    };
});
;
define('text!monster/monster.html',[],function(){return "<template class=\"monster au-animate\">\n  <img title.bind=\"type\"\n       alt.bind=\"type\"\n       class=\"monster__icon\"\n       src=\"assets/icons/monsters/${icon}.svg\" />\n  <div class=\"monster__stats-container\">\n    <span class=\"monster__stat monster__stat--hp\"\n          title=\"Health\">${stats.hp}</span>\n    <span class=\"monster__stat monster__stat--dmg\"\n          title=\"Damage\">${stats.dmg}</span>\n  </div>\n</template>\n";});;
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
define('player/player',["require", "exports", "aurelia-framework"], function (require, exports, aurelia_framework_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Player = (function () {
        function Player() {
        }
        __decorate([
            aurelia_framework_1.bindable,
            __metadata("design:type", String)
        ], Player.prototype, "currentTileId", void 0);
        __decorate([
            aurelia_framework_1.bindable,
            __metadata("design:type", String)
        ], Player.prototype, "name", void 0);
        return Player;
    }());
    exports.Player = Player;
});
;
define('text!player/player.html',[],function(){return "<template class=\"player\" data-aid=\"player\">\n  ${name}\n</template>\n";});;
define('resources/index',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
    exports.StatsIcons = {
        defense: "checked-shield",
        population: "icicles-aura",
        soldiers: "sword-brandish"
    };
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
define('sidebar/build-overview',["require", "exports", "aurelia-framework", "aurelia-store", "../buildings/fortress-building"], function (require, exports, aurelia_framework_1, aurelia_store_1, fortress_building_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var BuildOverview = (function () {
        function BuildOverview() {
        }
        Object.defineProperty(BuildOverview.prototype, "building", {
            get: function () {
                var _this = this;
                var currBuilding = this.state && this.state
                    .fortressBuildings
                    .find(function (fb) { return fb.type === _this.state.activeFortressBuildingConstruction; });
                if (currBuilding) {
                    return Object.assign(new fortress_building_1.FortressBuilding(), currBuilding);
                }
            },
            enumerable: true,
            configurable: true
        });
        __decorate([
            aurelia_framework_1.computedFrom("state.activeFortressBuildingConstruction"),
            __metadata("design:type", fortress_building_1.FortressBuilding),
            __metadata("design:paramtypes", [])
        ], BuildOverview.prototype, "building", null);
        BuildOverview = __decorate([
            aurelia_store_1.connectTo()
        ], BuildOverview);
        return BuildOverview;
    }());
    exports.BuildOverview = BuildOverview;
});
;
define('text!sidebar/build-overview.html',[],function(){return "<template class=\"build-overview\">\n  <img src=\"assets/icons/${building.icon || 'empty'}.svg\"\n       title.bind=\"building.name\"\n       alt.bind=\"building.name\"\n       class=\"${bem('build-overview', 'image', !state.activeFortressBuildingConstruction && 'hidden')}\">\n</template>\n";});;
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
define('sidebar/dice',["require", "exports", "aurelia-event-aggregator", "aurelia-framework", "aurelia-store", "rxjs/operators", "../animator/animator", "../store/index"], function (require, exports, aurelia_event_aggregator_1, aurelia_framework_1, aurelia_store_1, operators_1, animator_1, index_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Dice = (function () {
        function Dice(store, animator, ea) {
            var _this = this;
            this.store = store;
            this.animator = animator;
            this.ea = ea;
            this.keyShortcutSubscription = this.ea.subscribe("key-shortcut", function () { return _this.rollDice(); });
        }
        Dice.prototype.detach = function () {
            this.keyShortcutSubscription.dispose();
        };
        Dice.prototype.rollDice = function () {
            return __awaiter(this, void 0, void 0, function () {
                var playerOldRect, playerNewPos, playerNewCompStyle, playerNewBoundingRect, topAdjust, leftAdjust;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            playerOldRect = document.querySelector("player").getBoundingClientRect();
                            return [4, this.store.dispatch(index_1.rollDice)];
                        case 1:
                            _a.sent();
                            playerNewPos = document.querySelector("player");
                            playerNewCompStyle = window.getComputedStyle(playerNewPos);
                            playerNewBoundingRect = playerNewPos.getBoundingClientRect();
                            topAdjust = parseInt(playerNewCompStyle.top.replace("px", ""), 10);
                            leftAdjust = parseInt(playerNewCompStyle.left.replace("px", ""), 10);
                            return [4, this.animator.animate(playerNewPos, {
                                    left: [
                                        Math.ceil(playerOldRect.x - playerNewBoundingRect.x + leftAdjust) + "px",
                                        playerNewCompStyle.left
                                    ],
                                    top: [
                                        Math.ceil(playerOldRect.y - playerNewBoundingRect.y + topAdjust) + "px",
                                        playerNewCompStyle.top
                                    ],
                                }, 150)];
                        case 2:
                            _a.sent();
                            return [2];
                    }
                });
            });
        };
        Dice = __decorate([
            aurelia_framework_1.autoinject(),
            aurelia_store_1.connectTo(function (state) { return state.state.pipe(operators_1.map(function (value) { return ({ lastDiceRoll: value.lastDiceRoll, round: value.round }); })); }),
            __metadata("design:paramtypes", [aurelia_store_1.Store,
                animator_1.WebAnimationAnimator,
                aurelia_event_aggregator_1.EventAggregator])
        ], Dice);
        return Dice;
    }());
    exports.Dice = Dice;
});
;
define('text!sidebar/dice.html',[],function(){return "<template class=\"dice\"\n          title=\"Roll the dice\">\n  <h2 class=\"dice__round\" data-aid=\"current-round\">Round ${state.round}</h2>\n  <img src=\"assets/icons/dice.svg\"\n       click.trigger=\"rollDice()\"\n       alt=\"A dice ready to roll\"\n       class=\"dice__icon\"\n       data-aid=\"btn-dice-roll\" />\n\n  <span class=\"dice__last-roll\">${state.lastDiceRoll || 'none'}</span>\n</template>\n";});;
define('sidebar/index',["require", "exports", "./build-overview", "./dice", "./resources-overview", "./save", "./sidebar", "./stats-overview", "./tragedy-overview"], function (require, exports, build_overview_1, dice_1, resources_overview_1, save_1, sidebar_1, stats_overview_1, tragedy_overview_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function configure(config) {
        config.globalResources([
            sidebar_1.Sidebar,
            build_overview_1.BuildOverview,
            dice_1.Dice,
            resources_overview_1.ResourcesOverview,
            stats_overview_1.StatsOverview,
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
define('sidebar/resources-overview',["require", "exports", "aurelia-framework", "aurelia-store", "lodash", "rxjs/operators", "../resources/index"], function (require, exports, aurelia_framework_1, aurelia_store_1, lodash_1, operators_1, index_1) {
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
                    icon: index_1.ResourcesIcons[e[0]],
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
define('text!sidebar/resources-overview.html',[],function(){return "<template class=\"resources-overview\">\n  <ul class=\"resources-overview__list\">\n    <li class=\"resources-overview__item\"\n        repeat.for=\"res of resources\">\n      <img title.bind=\"res.name\"\n           alt.bind=\"res.name\"\n           class=\"resources-overview__image\"\n           src=\"assets/icons/${res.icon}.svg\" />\n      <span class=\"resources-overview__value\">${res.value}</span>\n    </li>\n  </ul>\n</template>\n";});;
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('sidebar/save',["require", "exports", "aurelia-framework", "aurelia-store", "../store/state"], function (require, exports, aurelia_framework_1, aurelia_store_1, state_1) {
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
            var data = new Blob([window.localStorage.getItem(state_1.LOCALSTORAGE_SAVE_KEY) || JSON.stringify(state_1.initialState)], { type: "application/json" });
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
define('text!sidebar/save.html',[],function(){return "<template class=\"save\">\n    <button class=\"save__button save__button--to-file\"\n            click.trigger=\"saveGame()\">Save game</button>\n    <button class=\"save__button save__button--new-game\"\n            click.trigger=\"newGame()\">New game</button>\n</template>\n";});;
define('sidebar/sidebar',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Sidebar = (function () {
        function Sidebar() {
        }
        return Sidebar;
    }());
    exports.Sidebar = Sidebar;
});
;
define('text!sidebar/sidebar.html',[],function(){return "<template class=\"sidebar\">\n  <dice class=\"sidebar__item\"></dice>\n  <resources-overview class=\"sidebar__item\"></resources-overview>\n  <stats-overview class=\"sidebar__item\"></stats-overview>\n  <div class=\"sidebar__order-container\">\n    <tragedy-overview></tragedy-overview>\n    <build-overview></build-overview>\n  </div>\n  <save class=\"sidebar__item\"></save>\n</template>\n";});;
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('sidebar/stats-overview',["require", "exports", "aurelia-framework", "aurelia-store", "lodash", "rxjs/operators", "../resources/index"], function (require, exports, aurelia_framework_1, aurelia_store_1, lodash_1, operators_1, index_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var StatsOverview = (function () {
        function StatsOverview() {
        }
        Object.defineProperty(StatsOverview.prototype, "stats", {
            get: function () {
                if (!this.state) {
                    return [];
                }
                return Object.entries(this.state)
                    .map(function (e) { return ({
                    icon: index_1.StatsIcons[e[0]],
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
        ], StatsOverview.prototype, "stats", null);
        StatsOverview = __decorate([
            aurelia_store_1.connectTo(function (store) { return store.state.pipe(operators_1.pluck("stats")); })
        ], StatsOverview);
        return StatsOverview;
    }());
    exports.StatsOverview = StatsOverview;
});
;
define('text!sidebar/stats-overview.html',[],function(){return "<template class=\"stats-overview\">\n  <ul class=\"stats-overview__list\">\n    <li class=\"stats-overview__item\"\n        repeat.for=\"res of stats\">\n      <img title.bind=\"res.name\"\n           alt.bind=\"res.name\"\n           class=\"stats-overview__image\"\n           src=\"assets/icons/${res.icon}.svg\" />\n      <span class=\"stats-overview__value\">${res.value}</span>\n    </li>\n  </ul>\n</template>\n";});;
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('sidebar/tragedy-overview',["require", "exports", "aurelia-framework", "aurelia-store", "rxjs/operators", "../board/tragedy"], function (require, exports, aurelia_framework_1, aurelia_store_1, operators_1, tragedy_1) {
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
define('text!sidebar/tragedy-overview.html',[],function(){return "<template class=\"tragedy-overview\">\n  <img src=\"assets/icons/${tragedy.image || 'empty'}.svg\"\n       title.bind=\"tragedy.name\"\n       alt.bind=\"tragedy.name\"\n       class=\"${bem('tragedy-overview', 'image', !tragedy && 'hidden')}\">\n</template>\n";});;
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
define('start-screen',["require", "exports", "@auth0/auth0-spa-js", "aurelia-framework", "aurelia-store", "./store/actions/commands"], function (require, exports, auth0_spa_js_1, aurelia_framework_1, aurelia_store_1, commands_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    auth0_spa_js_1 = __importDefault(auth0_spa_js_1);
    var StartScreen = (function () {
        function StartScreen(store, au) {
            this.store = store;
            this.au = au;
            this.playerName = "";
            this.store.registerAction("Start game", startGame);
            this.store.registerAction("Add a player", commands_1.addPlayer);
        }
        StartScreen.prototype.loginWithGithub = function () {
            return __awaiter(this, void 0, void 0, function () {
                var auth0, user;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4, auth0_spa_js_1.default({
                                client_id: "wtxHvxLecRBpapZwvSXMMmZsZ8fEEEzI",
                                domain: "enforted.eu.auth0.com",
                            })];
                        case 1:
                            auth0 = _a.sent();
                            return [4, auth0.loginWithPopup()];
                        case 2:
                            _a.sent();
                            return [4, auth0.getUser()];
                        case 3:
                            user = _a.sent();
                            this.start(user.nickname);
                            return [2];
                    }
                });
            });
        };
        StartScreen.prototype.startGame = function ($event) {
            var _a, _b;
            if (((_b = (_a = $event) === null || _a === void 0 ? void 0 : _a.target) === null || _b === void 0 ? void 0 : _b.tagName) === "INPUT" || !this.playerName || this.playerName.trim() === "") {
                return false;
            }
            this.start(this.playerName);
        };
        StartScreen.prototype.start = function (name) {
            this.store.pipe(commands_1.addPlayer, name).pipe(startGame).dispatch();
            this.au.setRoot("./app");
        };
        StartScreen = __decorate([
            aurelia_framework_1.autoinject(),
            __metadata("design:paramtypes", [aurelia_store_1.Store,
                aurelia_framework_1.Aurelia])
        ], StartScreen);
        return StartScreen;
    }());
    exports.StartScreen = StartScreen;
    function startGame(state) {
        return __assign(__assign({}, state), { gameStarted: true });
    }
    exports.startGame = startGame;
});
;
define('text!start-screen.html',[],function(){return "<template>\n  <require from=\"./main.css\"></require>\n\n  <div class=\"start-screen\">\n    <h1 class=\"start-screen__title\"><a class=\"start-screen__link\"\n         href=\"https://github.com/zewa666/enforted\">Enforted</a> - A board game made with Aurelia</h1>\n    <form submit.delegate=\"startGame()\"\n          click.delegate=\"startGame($event)\">\n      <div class=\"start-screen__icon\"\n           data-aid=\"btn-start-game\">Start your journey\n\n        <input class=\"start-screen__name\"\n               value.bind=\"playerName\"\n               data-aid=\"input-player-name\"\n               placeholder=\"Enter your name\" />\n      </div>\n    </form>\n    <div class=\"start-screen__oauth\">\n      or login with\n      <img src=\"assets/github-logo.png\"\n           class=\"start-screen__github\"\n           click.trigger=\"loginWithGithub()\" />\n    </div>\n\n    <p class=\"start-screen__attributions\">All icons from <a class=\"start-screen__link\"\n         href=\"https://game-icons.net/\">game-icons.net</a>, for details see the\n      <a class=\"start-screen__link\"\n         href=\"assets/icons/attribution.json\"\n         target=\"_blank\"> attributions file</a>\n    </p>\n  </div>\n</template>\n";});;
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
define('store/actions/commands',["require", "exports", "../../buildings/fortress-building", "../../buildings/tile-building"], function (require, exports, fortress_building_1, tile_building_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
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
    function destroyBuilding(state, tileId) {
        var idx = state.tileBuildings.findIndex(function (tb) { return tb.tileId === tileId; });
        return __assign(__assign({}, state), { tileBuildings: __spreadArrays(state.tileBuildings.slice(0, idx), state.tileBuildings.slice(idx + 1)) });
    }
    exports.destroyBuilding = destroyBuilding;
    function reinforceTileBuilding(state, tileId) {
        var idx = state.tileBuildings.findIndex(function (tb) { return tb.tileId === tileId; });
        return __assign(__assign({}, state), { stats: __assign(__assign({}, state.stats), { soldiers: state.stats.soldiers - 1 }), tileBuildings: __spreadArrays(state.tileBuildings.slice(0, idx), [
                __assign(__assign({}, state.tileBuildings[idx]), { garrison: state.tileBuildings[idx].garrison + 1 })
            ], state.tileBuildings.slice(idx + 1)) });
    }
    exports.reinforceTileBuilding = reinforceTileBuilding;
    function buyFortressBuilding(state, type) {
        var costs = fortress_building_1.FortressBuildingResourceCost[type];
        if (state.activeFortressBuildingConstruction) {
            return false;
        }
        return __assign(__assign({}, state), { activeFortressBuildingConstruction: type, fortressBuildings: __spreadArrays(state.fortressBuildings, [
                { type: type }
            ]), resources: {
                blood: state.resources.blood - costs.blood,
                coal: state.resources.coal - costs.coal,
                food: state.resources.food - costs.food,
                gold: state.resources.gold - costs.gold,
                iron: state.resources.iron - costs.iron,
                mana: state.resources.mana - costs.mana,
                stone: state.resources.stone - costs.stone,
                wood: state.resources.wood - costs.wood,
            }, stats: __assign(__assign({}, state.stats), { defense: type === "palisades" ? state.stats.defense + 10 : state.stats.defense }) });
    }
    exports.buyFortressBuilding = buyFortressBuilding;
    function addPlayer(state, name) {
        return __assign(__assign({}, state), { players: [{
                    currentTileId: state.tiles[0].id,
                    name: name
                }] });
    }
    exports.addPlayer = addPlayer;
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
define('store/actions/dice-roll',["require", "exports", "../../board/tragedy", "../helper", "./monsters"], function (require, exports, tragedy_1, helper_1, monsters_1) {
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
        var monsterRollState = monsters_1.monsterRoll(state, diceOverload);
        return gatherFortressBuilding(__assign(__assign({}, state), { activeFortressBuildingConstruction: isNextRound ? undefined : state.activeFortressBuildingConstruction, activeTragedy: isNextRound
                ? undefined
                : isStumblingStep && newStumblingSteps === undefined
                    ? undefined
                    : state.activeTragedy, activeTragedyParams: isNextRound
                ? undefined
                : isStumblingStep
                    ? newStumblingSteps
                    : state.activeTragedyParams, lastDiceRoll: roll, monsters: monsters_1.generateWave(monsterRollState, isNextRound).monsters, players: [
                __assign(__assign({}, state.players[0]), { currentTileId: newPosition > state.tiles.length - 1
                        ? state.tiles[Math.abs(newPosition - state.tiles.length)].id
                        : state.tiles[newPosition].id })
            ], purchaseInProgress: undefined, resources: isNextRound
                ? gatherResources(state).resources
                : state.resources, round: isNextRound
                ? state.round + 1
                : state.round, stats: monsterRollState.stats }), isNextRound);
    }
    exports.rollDice = rollDice;
    function gatherFortressBuilding(state, isNextRound) {
        if (!isNextRound) {
            return state;
        }
        var newState = __assign(__assign({}, state), { resources: __assign({}, state.resources), stats: __assign({}, state.stats) });
        return newState.fortressBuildings.reduce(function (prev, curr) {
            switch (curr.type) {
                case "bakery":
                    var res = prev.resources.coal > 0 && "coal" || prev.resources.wood > 0 && "wood";
                    if (res) {
                        prev.resources[res] -= 1;
                        prev.stats.population += 1;
                    }
                case "blacksmith_shop":
                    if (prev.resources.iron > 0 &&
                        prev.resources.coal > 0) {
                        prev.resources.iron -= 1;
                        prev.resources.coal -= 1;
                        prev.stats.soldiers += 1;
                    }
                case "bank":
                    if (prev.resources.gold > 0) {
                        prev.resources.gold += 1;
                    }
                case "magician_tower":
                    if (prev.resources.mana > 2) {
                        prev.resources.mana -= 3;
                        prev.fireFountainsActive = true;
                    }
                    else {
                        prev.fireFountainsActive = false;
                    }
            }
            return prev;
        }, newState);
    }
    exports.gatherFortressBuilding = gatherFortressBuilding;
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
define('store/actions/monsters',["require", "exports", "../../buildings/tile-building", "../../monster/monster", "../helper"], function (require, exports, tile_building_1, monster_1, helper_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function monsterRoll(state, diceOverload) {
        var kills = 0;
        var monsters = state.monsters.map(function (m) {
            var idxOfTile = state.tiles.findIndex(function (t) { return t.id === m.currentTileId; });
            var roll = diceOverload || helper_1.randBetween(1, 6);
            var newPosition = (idxOfTile + roll) > state.tiles.length - 1
                ? state.tiles.length - 1
                : idxOfTile + roll;
            var nextId = newPosition > state.tiles.length - 1
                ? state.tiles[state.tiles.length - 1].id
                : state.tiles[newPosition].id;
            var tileBuilding = state.tileBuildings.find(function (tb) { return tb.tileId === nextId; });
            var newHp = tileBuilding ? m.stats.hp - tile_building_1.calculateDmg(tileBuilding.garrison) : m.stats.hp;
            if (idxOfTile === state.tiles.length - 1) {
                var _a = state.stats, defense = _a.defense, soldiers = _a.soldiers;
                var attackChance = Math.floor((100 - defense) / Math.ceil(roll / 2));
                var monsterAttackSuccess = helper_1.randBetween(1, 100) <= attackChance;
                var effectiveMonsterDmg = m.stats.dmg - soldiers;
                if (!monsterAttackSuccess) {
                    newHp -= effectiveMonsterDmg < 0
                        ? Math.abs(effectiveMonsterDmg)
                        : 2;
                }
                else if (monsterAttackSuccess && effectiveMonsterDmg > 0) {
                    kills += 1;
                }
            }
            if (newHp <= 0 ||
                (state.tiles[newPosition].type === "fire_fountain" &&
                    state.fireFountainsActive === true)) {
                return undefined;
            }
            return __assign(__assign({}, m), { currentTileId: nextId, stats: __assign(__assign({}, m.stats), { hp: newHp }) });
        }).filter(function (m) { return m; });
        return __assign(__assign({}, state), { monsters: monsters, stats: __assign(__assign({}, state.stats), { population: state.stats.population - kills }) });
    }
    exports.monsterRoll = monsterRoll;
    function generateWave(state, isNextRound) {
        if (!isNextRound || !exports.wavesAtRounds.hasOwnProperty(state.round + 1)) {
            return state;
        }
        var newMonsters = exports.wavesAtRounds[state.round + 1].map(function (type) { return ({
            currentTileId: state.tiles[0].id,
            stats: __assign({}, monster_1.MonsterPropMap[type].stats),
            type: type
        }); });
        return __assign(__assign({}, state), { monsters: __spreadArrays(state.monsters, newMonsters) });
    }
    exports.generateWave = generateWave;
    exports.wavesAtRounds = {
        15: __spreadArrays(new Array(2).fill("Zombie")),
        25: __spreadArrays(new Array(2).fill("Zombie"), ["Skeleton"]),
        32: __spreadArrays(new Array(3).fill("Skeleton")),
    };
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
define('store/actions/tragedy-events',["require", "exports", "../../board/tragedy", "../helper", "./commands"], function (require, exports, tragedy_1, helper_1, commands_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function sacrificeResources(state, resourceType, byAmount) {
        var _a;
        return __assign(__assign({}, state), { activeTragedy: tragedy_1.AvailableTragedyEvents.Sacrifice, resources: __assign(__assign({}, state.resources), (_a = {}, _a[resourceType] = Math.max(0, state.resources[resourceType] - byAmount), _a)) });
    }
    exports.sacrificeResources = sacrificeResources;
    function ragingFire(state, tileId) {
        var newState = commands_1.destroyBuilding(state, tileId);
        newState.activeTragedy = tragedy_1.AvailableTragedyEvents.RagingFire;
        return newState;
    }
    exports.ragingFire = ragingFire;
    function forgottenEquipment(state) {
        return __assign(__assign({}, state), { activeTragedy: undefined, activeTragedyParams: undefined, fireFountainsActive: false, players: [
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
define('store/index',["require", "exports", "./state", "./actions/commands", "./actions/dice-roll"], function (require, exports, state_1, commands_1, dice_roll_1) {
    "use strict";
    function __export(m) {
        for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
    }
    Object.defineProperty(exports, "__esModule", { value: true });
    __export(state_1);
    __export(commands_1);
    __export(dice_roll_1);
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
    exports.initialState = {
        fireFountainsActive: false,
        fortressBuildings: [],
        gameStarted: false,
        lastDiceRoll: undefined,
        monsters: [],
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
        stats: {
            defense: 0,
            population: 10,
            soldiers: 0
        },
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
        }); }), [
            {
                id: helper_1.guid(),
                isCorner: true,
                placement: "bottom",
                ring: "inner",
                type: "fire_fountain",
            }
        ], Array.from(Array(6), function (_, idx) { return ({
            id: helper_1.guid(),
            isCorner: false,
            placement: "bottom",
            ring: "inner",
            type: "iron",
        }); }), [
            {
                id: helper_1.guid(),
                isCorner: false,
                placement: "bottom",
                ring: "inner",
                type: "construction-site",
            },
            {
                id: helper_1.guid(),
                isCorner: true,
                placement: "bottom",
                ring: "inner",
                type: "construction-site",
            },
            {
                id: helper_1.guid(),
                isCorner: false,
                placement: "left",
                ring: "inner",
                type: "construction-site",
            }
        ], Array.from(Array(6), function (_, idx) { return ({
            id: helper_1.guid(),
            isCorner: false,
            placement: "left",
            ring: "inner",
            type: idx === 3 ? "sacred_grounds" : "mana",
        }); }), [
            {
                id: helper_1.guid(),
                isCorner: true,
                placement: "top",
                ring: "inner",
                type: "fire_fountain",
            }
        ], Array.from(Array(7), function (_, idx) { return ({
            id: helper_1.guid(),
            isCorner: false,
            placement: "top",
            ring: "inner",
            type: idx === 4 ? "sacred_grounds" : "coal",
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
            type: idx === 6 ? "rally_point" : "blood",
        }); }))
    };
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
define('monster',['monster/index'],function(m){return m;});
define('player',['player/index'],function(m){return m;});
define('sidebar',['sidebar/index'],function(m){return m;});
//# sourceMappingURL=app-bundle.js.map