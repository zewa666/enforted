import { bootstrap } from "aurelia-bootstrapper";
import { PLATFORM } from "aurelia-framework";
import { executeSteps, Store } from "aurelia-store";
import { ComponentTester, StageComponent } from "aurelia-testing";

import { FortressBuilding } from "../../src/buildings/fortress-building";
import { buyFortressBuilding, LOCALSTORAGE_SAVE_KEY, rollDice, State } from "../../src/store/index";

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

  describe("the bakery", () => {
    async function addBakeryTo(fixture: string) {
      const ret = await loadComponentWithFixture(fixture);
      ret.state = {
        ...ret.state,
        fortressBuildings: [
          ...ret.state.fortressBuildings,
          { type: "bakery" } as FortressBuilding
        ]
      };
      ret.store.resetToState(ret.state);

      return ret;
    }

    it("should produce no new population if neither coal nor wood are available", async () => {
      const { store } = await addBakeryTo("no-resources");

      await executeSteps(
        store,
        false,
        (res) => {
          expect(res.resources).toEqual(expect.objectContaining({ coal: 0, wood: 0 }));
          expect(res.stats.population).toBe(10);
          store.dispatch(rollDice, res.tiles.length);
        },
        (res) => expect(res.stats.population).toBe(10)
      );
    });

    it("should produce new population if coals are available", async () => {
      const { store, state } = await addBakeryTo("no-resources");
      store.resetToState({ ...state, resources: { ...state.resources, coal: 1 } });

      await executeSteps(
        store,
        false,
        (res) => {
          expect(res.resources).toEqual(expect.objectContaining({ coal: 1, wood: 0 }));
          expect(res.stats.population).toBe(10);
          store.dispatch(rollDice, res.tiles.length);
        },
        (res) => {
          expect(res.stats.population).toBe(11);
          expect(res.resources.coal).toBe(0);
        }
      );
    });

    it("should produce new population if wood is available", async () => {
      const { store, state } = await addBakeryTo("no-resources");
      store.resetToState({ ...state, resources: { ...state.resources, wood: 1 } });

      await executeSteps(
        store,
        false,
        (res) => {
          expect(res.resources).toEqual(expect.objectContaining({ wood: 1, coal: 0 }));
          expect(res.stats.population).toBe(10);
          store.dispatch(rollDice, res.tiles.length);
        },
        (res) => {
          expect(res.stats.population).toBe(11);
          expect(res.resources.wood).toBe(0);
        }
      );
    });
  });

  describe("palisades", () => {
    it("should increase the defense when built", async () => {
      const { store } = await loadComponentWithFixture("massive-resources");

      await executeSteps(
        store,
        false,
        (res) => {
          expect(res.stats.defense).toBe(0);
          store.dispatch(buyFortressBuilding, "palisades");
        },
        (res) => expect(res.stats.defense).toBe(10)
      );
    });
  });

  describe("the bank", () => {
    it("should increase gold if some is present", async () => {
      const { store } = await loadComponentWithFixture("massive-resources");
      let goldAfterBank = -1;

      await executeSteps(
        store,
        false,
        () => store.dispatch(buyFortressBuilding, "bank"),
        (res) => {
          goldAfterBank = res.resources.gold;
          store.dispatch(rollDice, res.tiles.length);
        },
        (res) => expect(res.resources.gold).toBe(goldAfterBank + 1)
      );
    });

    it("should not increase gold if none is present", async () => {
      const { store } = await loadComponentWithFixture("massive-resources");

      await executeSteps(
        store,
        false,
        () => store.dispatch(buyFortressBuilding, "bank"),
        (res) => {
          store.resetToState({ ...res, resources: { ...res.resources, gold: 0 }});
          store.dispatch(rollDice, res.tiles.length);
        },
        (res) => expect(res.resources.gold).toBe(0)
      );
    });
  });

  describe("the blacksmith shop", () => {
    async function addBlacksmithShopTo(fixture: string) {
      const ret = await loadComponentWithFixture(fixture);
      ret.state = {
        ...ret.state,
        fortressBuildings: [
          ...ret.state.fortressBuildings,
          { type: "blacksmith_shop" } as FortressBuilding
        ]
      };
      ret.store.resetToState(ret.state);

      return ret;
    }

    it("should produce no new population if not all requirements are satisfied are available", async () => {
      const { store } = await addBlacksmithShopTo("no-resources");

      await executeSteps(
        store,
        false,
        (res) => {
          expect(res.resources).toEqual(expect.objectContaining({ coal: 0, iron: 0 }));
          expect(res.stats.soldiers).toBe(0);
          store.dispatch(rollDice, res.tiles.length);
        },
        (res) => expect(res.stats.soldiers).toBe(0)
      );
    });

    it("should produce new soldier if both coals and iron are available", async () => {
      const { store, state } = await addBlacksmithShopTo("no-resources");
      store.resetToState({ ...state, resources: { ...state.resources, coal: 1, iron: 1 } });

      await executeSteps(
        store,
        false,
        (res) => {
          expect(res.resources).toEqual(expect.objectContaining({ coal: 1, iron: 1 }));
          expect(res.stats.soldiers).toBe(0);
          store.dispatch(rollDice, res.tiles.length);
        },
        (res) => {
          expect(res.stats.soldiers).toBe(1);
          expect(res.resources).toEqual(expect.objectContaining({ coal: 0, iron: 0 }));
        }
      );
    });
  });
});
