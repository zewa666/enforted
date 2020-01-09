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
    .feature("animator", (instance: WebAnimationAnimator) => {
      instance.storedEnterAnimations["TILE-BUILDING"] = {
        keyframes: [
          { transform: "translate3d(0, 70%, 0)", opacity: "0"},
          { transform: "translate3d(0, 0, 0)", opacity: "1"}
        ],
        options: 300
      };
      instance.storedLeaveAnimations["TILE-BUILDING"] = {
        keyframes: [
          { transform: "scale(1)", opacity: "1", filer: "blur(0px)" },
          { transform: "scale(2)", opacity: "0", filer: "blur(4px)" }
        ],
        options: {
          duration: 1000,
          easing: "cubic-bezier(0.165, 0.840, 0.440, 1.000)",
          fill: "both",
        }
      };

      return instance;
    })
    .feature("board")
    .feature("player")
    .feature("sidebar")
    .feature("buildings");

  aurelia.use.developmentLogging(environment.debug ? "debug" : "warn");

  if (environment.testing) {
    aurelia.use.plugin("aurelia-testing");
  }

  aurelia.start().then(() => aurelia.setRoot());
}
