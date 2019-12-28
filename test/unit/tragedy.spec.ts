import { bootstrap } from "aurelia-bootstrapper";
import { PLATFORM } from "aurelia-pal";
import { executeSteps, Store } from "aurelia-store";
import { ComponentTester, StageComponent } from "aurelia-testing";

import { AvailableTragedyEvents, tragedyEvents } from "../../src/board/tragedy";
import {
  forgottenEquipment,
  ragingFire,
  sacrificeResources
} from "../../src/store/actions/tragedy-events";
import { LOCALSTORAGE_SAVE_KEY, rollDice, State } from "../../src/store/index";

describe("tragedy events", () => {
  it("should have a total weight of 1", () => {
    const total = tragedyEvents.reduce((acc, curr) => {
      acc += curr.weight;
      return acc;
    }, 0);

    expect(total).toBeCloseTo(1);
  });

  describe("staged", () => {
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

    it("should set the drawn tragedy for the rounds duration", async () => {
      const { state, store } = await loadComponentWithFixture("tragedy-everywhere");

      expect(state.activeTragedy).toBeUndefined();
      await executeSteps(store, false,
        () => store.dispatch(sacrificeResources, "wood", 1),
        (res) => {
          expect(res.activeTragedy).toBe(AvailableTragedyEvents.Sacrifice);
          store.dispatch(rollDice, res.tiles.length);
        },
        (res) => {
          expect(res.activeTragedy).toBeUndefined();
        },
      );
    });

    it("should destroy a tileBuilding with raging fire", async () => {
      const { state, store } = await loadComponentWithFixture("tragedy-everywhere");

      await executeSteps(store, false,
        () => store.dispatch(ragingFire, state.tileBuildings[0].tileId),
        (res) => expect(res.tileBuildings.length).toBe(0)
      );
    });

    it("should send back to start and remove tragedy when forgotten equipment is drawn", async () => {
      const { store } = await loadComponentWithFixture("tragedy-everywhere");

      await executeSteps(store, false,
        () => store.dispatch(forgottenEquipment),
        (res) => {
          expect(res.players[0].currentTileId).toBe(res.tiles.find((t) => t.type === "start").id);
          expect(res.activeTragedy).toBeUndefined();
        }
      );
    });
  });
});
