import { Aurelia } from "aurelia-framework";
import "web-animations-js";
import environment from "./environment";

import { WebAnimationAnimator } from "./animator/animator";
import { initialState } from "./store/index";

export function configure(aurelia: Aurelia) {
  aurelia.use
    .standardConfiguration()
    .plugin("aurelia-bem")
    .plugin("aurelia-store", {
      initialState
    })
    .plugin("aurelia-dialog")
    .feature("board")
    .feature("player")
    .feature("sidebar")
    .feature("buildings");

  aurelia.use.developmentLogging(environment.debug ? "debug" : "warn");

  if (!(window as any).Cypress) {
    aurelia.use.feature("animator", (instance: WebAnimationAnimator) => {
      instance.storedEnterAnimations["TILE-BUILDING"] = {
        keyframes: [
          { transform: "translate3d(0, 70%, 0)", opacity: "0"},
          { transform: "translate3d(0, 0, 0)", opacity: "1"}
        ],
        options: 300
      };
      instance.storedLeaveAnimations["TILE-BUILDING"] = {
        keyframes: [
          { transform: "translate3d(0, 0, 0)", opacity: "1"},
          { transform: "translate3d(0, 70%, 0)", opacity: "0"}
        ],
        options: 1000
      };

      return instance;
    });
  }
  if (environment.testing) {
    aurelia.use.plugin("aurelia-testing");
  }

  aurelia.start().then(() => aurelia.setRoot());
}
