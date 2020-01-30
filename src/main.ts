import { Aurelia } from "aurelia-framework";
import { rehydrateFromLocalStorage } from "aurelia-store";
import "web-animations-js";

import { WebAnimationAnimator } from "./animator/animator";
import environment from "./environment";
import { initialState, LOCALSTORAGE_SAVE_KEY, State } from "./store/index";

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/enforted/sw.js", { scope: "." }).then((reg) => {
    // tslint:disable-next-line:no-console
    console.log("Successfully registered service worker. Scope is " + reg.scope);
  }).catch((error) => {
    // tslint:disable-next-line:no-console
    console.log("Failed registering service worker " + error);
  });
}

export async function configure(aurelia: Aurelia) {
  aurelia.use
    .standardConfiguration()
    .plugin("aurelia-bem")
    .plugin("aurelia-store", {
      initialState
    })
    .plugin("aurelia-dialog")
    .feature("board")
    .feature("player")
    .feature("monster")
    .feature("sidebar")
    .feature("buildings");

  aurelia.use.developmentLogging(environment.debug ? "debug" : "warn");

  if (!(window as any).Cypress) {
    aurelia.use.feature("animator", (instance: WebAnimationAnimator) => {
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
  if (environment.testing) {
    aurelia.use.plugin("aurelia-testing");
  }

  await aurelia.start();

  const storage = rehydrateFromLocalStorage({}, LOCALSTORAGE_SAVE_KEY) as State;
  aurelia.setRoot(storage.gameStarted ? "./app" : "./start-screen");
}
