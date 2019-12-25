import { bootstrap } from "aurelia-bootstrapper";
import { PLATFORM } from "aurelia-pal";
import { ComponentTester, StageComponent } from "aurelia-testing";
import { LOCALSTORAGE_SAVE_KEY, State } from "../../src/store/state";

describe("Shrines", () => {
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
      store: component.viewModel.store,
      view: component.element,
      vm: component.viewModel,
    };
  }

  describe("with having one", () => {
    it("should have one tile-building shrine", async () => {
      const { state } = await loadComponentWithFixture("shrine-one");

      expect(state.tileBuildings.filter((tb) => tb.type === "shrine").length).toBe(1);
    });
  });
});
