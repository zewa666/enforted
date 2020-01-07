import { Aurelia } from "aurelia-framework";
import "web-animations-js";
import environment from "./environment";

import { initialState } from "./store/index";

export function configure(aurelia: Aurelia) {
  aurelia.use
    .standardConfiguration()
    .plugin("aurelia-bem")
    .plugin("aurelia-store", {
      initialState
    })
    .plugin("aurelia-dialog")
    .feature("animator")
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
