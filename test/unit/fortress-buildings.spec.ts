import { executeSteps } from "aurelia-store";

import { FortressBuilding } from "../../src/buildings/fortress-building";
import { forgottenEquipment } from "../../src/store/actions/tragedy-events";
import { buyFortressBuilding, rollDice, State } from "../../src/store/index";
import { stageBoard } from "../staged-helper";

describe("fortress buildings", () => {
  const { loadComponentWithFixture } = stageBoard(beforeEach, afterEach);

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
          store.resetToState({ ...res, resources: { ...res.resources, gold: 0 } });
          store.dispatch(rollDice, res.tiles.length);
        },
        (res) => expect(res.resources.gold).toBe(0)
      );
    });
  });

  describe("the magican tower", () => {
    it("should activate the fire fountains for the next round if enough mana is available", async () => {
      const { store } = await loadComponentWithFixture("massive-resources");
      let manaAfterMagicianTower = -1;

      await executeSteps(
        store,
        false,
        () => store.dispatch(buyFortressBuilding, "magician_tower"),
        (res) => {
          manaAfterMagicianTower = res.resources.mana;
          expect(res.fireFountainsActive).toBe(false);
          store.dispatch(rollDice, res.tiles.length);
        },
        (res) => {
          expect(res.resources.mana).toBe(manaAfterMagicianTower - 3);
          expect(res.fireFountainsActive).toBe(true);
        }
      );
    });

    it("should not activate fire fountains if not enough mana is available", async () => {
      const { store } = await loadComponentWithFixture("massive-resources");

      await executeSteps(
        store,
        false,
        () => store.dispatch(buyFortressBuilding, "magician_tower"),
        (res) => {
          store.resetToState({ ...res, resources: { ...res.resources, mana: 0 } });
          expect(res.fireFountainsActive).toBe(false);
          store.dispatch(rollDice, res.tiles.length);
        },
        (res) => {
          expect(res.fireFountainsActive).toBe(false);
        }
      );
    });

    it("should turn off the fire fountains if forgotten equipment tragedy is rolled", async () => {
      const { store } = await loadComponentWithFixture("massive-resources");

      await executeSteps(
        store,
        false,
        () => store.dispatch(buyFortressBuilding, "magician_tower"),
        (res) => {
          expect(res.fireFountainsActive).toBe(false);
          store.dispatch(rollDice, res.tiles.length);
        },
        (res) => {
          expect(res.fireFountainsActive).toBe(true);
          store.dispatch(forgottenEquipment);
        },
        (res) => expect(res.fireFountainsActive).toBe(false)
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
