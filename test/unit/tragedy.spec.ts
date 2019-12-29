import { bootstrap } from "aurelia-bootstrapper";
import { PLATFORM } from "aurelia-pal";
import { executeSteps, Store } from "aurelia-store";
import { ComponentTester, StageComponent } from "aurelia-testing";

import { AvailableTragedyEvents, tragedyEvents } from "../../src/board/tragedy";
import {
  collapsedMines,
  defiledAltar,
  forgottenEquipment,
  pausedResourceProduction,
  ragingFire,
  sacrificeResources
} from "../../src/store/actions/tragedy-events";
import {
  LOCALSTORAGE_SAVE_KEY,
  PRODUCED_RESOURCES_PER_ROUND,
  rollDice,
  State
} from "../../src/store/index";

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
      const id = state.tileBuildings[0].tileId;

      await executeSteps(store, false,
        () => store.dispatch(ragingFire, id),
        (res) => expect(res.tileBuildings.findIndex((tb) => tb.tileId === id)).toBe(-1)
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

    it("should destroy a random shrine", async () => {
      const { store, state } = await loadComponentWithFixture("tragedy-everywhere");

      await executeSteps(store, false,
        () => {
          expect(state.tileBuildings.filter((tb) => tb.type === "shrine").length).toBe(2);
          store.dispatch(defiledAltar);
        },
        (res) => {
          expect(res.tileBuildings.filter((tb) => tb.type === "shrine").length).toBe(1);
        }
      );
    });

    it("should not produce any resources after a round if the corresponding tragedy is active", async () => {
      const { store, state } = await loadComponentWithFixture("tragedy-everywhere");

      store.resetToState({
        ...state,
        tileBuildings: state.tileBuildings.filter((tb) => tb.type === "sawmill")
      });

      await executeSteps(store, false,
        (res) => {
          expect(res.tileBuildings.length).toBe(1);
          expect(res.resources.wood).toBe(0);
          store.dispatch(pausedResourceProduction, AvailableTragedyEvents.BurningTrees);
        },
        (res) => {
          store.dispatch(rollDice, res.tiles.length + 1);
        },
        (res) => {
          expect(res.resources.wood).toBe(0);
          // now the tragedy event is gone
          store.dispatch(rollDice, res.tiles.length + 1);
        },
        (res) => {
          expect(res.resources.wood).toBe(PRODUCED_RESOURCES_PER_ROUND);
        },
      );
    });

    it("should not produce any resources of the drawn collapside mines", async () => {
      const { store, state } = await loadComponentWithFixture("tragedy-everywhere");

      store.resetToState({
        ...state,
        tileBuildings: [
          {
            placement: "bottom",
            tileId: "5b421298-75e4-550e-939d-589770dd4d2f",
            type: "iron_mine"
          }
        ]
      });

      await executeSteps(store, false,
        (res) => {
          expect(res.resources).toEqual(expect.objectContaining({
            coal: 0,
            gold: 0,
            iron: 0
          }));
          store.dispatch(collapsedMines, "iron_mine");
        },
        (res) => {
          store.dispatch(rollDice, res.tiles.length + 1);
        },
        (res) => {
          expect(res.resources.iron).toBe(0);
          // now the tragedy event is gone
          store.dispatch(rollDice, res.tiles.length + 1);
        },
        (res) => {
          expect(res.resources.iron).toBe(PRODUCED_RESOURCES_PER_ROUND);
        },
      );
    });
  });
});
