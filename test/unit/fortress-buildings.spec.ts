import { bootstrap } from "aurelia-bootstrapper";
import { PLATFORM } from "aurelia-framework";
import { executeSteps, Store } from "aurelia-store";
import { ComponentTester, StageComponent } from "aurelia-testing";

import { buyFortressBuilding, LOCALSTORAGE_SAVE_KEY, State } from "../../src/store/index";

describe("fortress buildings", () => {
  let component: ComponentTester;

  beforeEach(() => {
    localStorage.clear();
    PLATFORM.global.localStorage = localStorage;

    component = StageComponent
      .withResources("../../src/app")
      .inView("<app></app>");
  });

  afterEach(() => component.dispose());

  async function loadComponentWithFixture(fixture: string) {
    const fixtureString = JSON.stringify(require(`./fixtures/${fixture}.json`));

    localStorage.setItem(LOCALSTORAGE_SAVE_KEY, fixtureString);
    await component.create(bootstrap);

    return {
      state: component.viewModel.store._state.getValue() as State,
      store: component.viewModel.store as Store<State>,
      view: component.element,
      vm: component.viewModel,
    };
  }

  it("should be allowed to only build one per round", async () => {
    const { store } = await loadComponentWithFixture("massive-resources");
    let firstState: State;

    await executeSteps(
      store,
      false,
      () => store.dispatch(buyFortressBuilding, "bakery"),
      (res) => {
        firstState = res;
        expect(res.activeFortressBuildingConstruction).toBe("bakery");
        store.dispatch(buyFortressBuilding, "bakery");
      }
    );

    expect(firstState).toBe((store as any)._state.getValue());
  });

});
