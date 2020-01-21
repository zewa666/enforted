import { bootstrap } from "aurelia-bootstrapper";
import { PLATFORM } from "aurelia-pal";
import { Store } from "aurelia-store";
import { ComponentTester, StageComponent } from "aurelia-testing";

import { LOCALSTORAGE_SAVE_KEY, State } from "../src/store/state";

export interface ArrangedTestData {
  state: State;
  store: Store<State>;
  view: Element;
  vm: any;
}

export interface Staged {
  component: ComponentTester;
  loadComponentWithFixture: (fixture: string) => Promise<ArrangedTestData>;
}

export function stageBoard(be: jest.Lifecycle, ae: jest.Lifecycle): Staged {
  const staged = {
    component: null,
    loadComponentWithFixture: async (fixture: string) => {
      const fixtureString = JSON.stringify(require(`./unit/fixtures/${fixture}.json`));

      localStorage.setItem(LOCALSTORAGE_SAVE_KEY, fixtureString);
      const component = staged.component;
      await component.create(bootstrap);

      return {
        state: component.viewModel.store._state.getValue() as State,
        store: component.viewModel.store as Store<State>,
        view: component.element,
        vm: component.viewModel,
      };
    }
  };

  // tslint:disable-next-line:only-arrow-functions
  be(function() {
    localStorage.clear();
    PLATFORM.global.localStorage = localStorage;

    staged.component = StageComponent
      .withResources("../../src/app")
      .inView("<app></app>");
  });

  // tslint:disable-next-line:only-arrow-functions
  ae(function() { staged.component.dispose(); });

  return staged as Staged;
}
