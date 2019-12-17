import * as cypress from 'cypress';
import * as config from '../../cypress.config';
import { CLIOptions } from 'aurelia-cli';
import { serve as runAppServer, shutdownAppServer } from './run';

const runCypress = (cb) => {
  if (CLIOptions.hasFlag('run')) {
    cypress
      .run(config)
      .then(results => (results.totalFailed === 0 ? cb() : cb('Run failed!')))
      .then(shutdownAppServer)
      .catch(cb);
  } else {
    cypress.open(config);
  }
}

export default (cb) => {
  if (CLIOptions.hasFlag('start')) {
    runAppServer();
    runCypress(cb);
    return;
  }

  runCypress(cb);
};
