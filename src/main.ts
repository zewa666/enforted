import {Aurelia} from 'aurelia-framework'
import environment from './environment';

import { initialState } from "./store/index";

export function configure(aurelia: Aurelia) {
  aurelia.use
    .standardConfiguration()
    .plugin("aurelia-bem")
    .plugin("aurelia-store", {
      initialState
    })
    .feature('board')
    .feature('player')
    .feature('commands')
    .feature("buildings");

  aurelia.use.developmentLogging(environment.debug ? 'debug' : 'warn');

  if (environment.testing) {
    aurelia.use.plugin('aurelia-testing');
  }

  aurelia.start().then(() => aurelia.setRoot());
}
