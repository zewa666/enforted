import { executeSteps } from "aurelia-store";

import { Monster } from "../../src/monster/monster";
import { wavesAtRounds } from "../../src/store/actions/monsters";
import { rollDice } from "../../src/store/index";
import { stageBoard } from "../staged-helper";
import { getPreviousTileOf, getTileByType } from "./helpers";

describe("monsters", () => {
  const { loadComponentWithFixture } = stageBoard(beforeEach, afterEach);

  it("should move every turn with the player", async () => {
    const { store, state } = await loadComponentWithFixture("monster-vs-farms");
    const positionBegin = state.monsters.map((m) => m.currentTileId);

    await executeSteps(store, false,
      () => store.dispatch(rollDice),
      (res) => expect(positionBegin).not.toEqual(res.monsters.map((m) => m.currentTileId)),
    );
  });

  it("should take damage from stepping on tile buildings", async () => {
    const { store, state } = await loadComponentWithFixture("monster-vs-farms");
    store.resetToState({
      ...state,
      monsters: [
        {
          ...state.monsters[0],
          currentTileId: getTileByType(state, "sacred_grounds").id
        } as Monster,
        ...state.monsters.slice(1)
      ]
    });

    const initialHpOfFirstMonster = state.monsters[0].stats.hp;

    await executeSteps(store, false,
      (res) => {
        expect(res.monsters[0].stats.hp).toBe(initialHpOfFirstMonster);
        store.dispatch(rollDice);
      },
      (res) => expect(res.monsters[0].stats.hp).toBeLessThan(initialHpOfFirstMonster)
    );
  });

  it("should get killed instantly by stepping on active fire fountains", async () => {
    const { store, state } = await loadComponentWithFixture("monster-vs-farms");
    const firstFireFountain = getTileByType(state, "fire_fountain");
    const tileBefore = getPreviousTileOf(state, firstFireFountain.id);

    store.resetToState({
      ...state,
      fireFountainsActive: true,
      monsters: [
        {
          ...state.monsters[0],
          currentTileId: tileBefore.id
        } as Monster,
        ...state.monsters.slice(1)
      ]
    });

    await executeSteps(store, false,
      (res) => {
        expect(res.fireFountainsActive).toBe(true);
        store.dispatch(rollDice, 1);
      },
      (res) => expect(res.monsters.length).toBe(state.monsters.length - 1)
    );
  });

  it("should appear in waves", async () => {
    const { store, state } = await loadComponentWithFixture("massive-resources");

    store.resetToState({
      ...state,
      round: parseInt(Object.keys(wavesAtRounds)[0], 10) - 1
    });

    await executeSteps(store, false,
      (res) => {
        expect(res.monsters).toEqual([]);
        store.dispatch(rollDice, res.tiles.length);
      },
      (res) => expect(res.monsters).not.toEqual([])
    );
  });

  it("should add new wave to existing monsters", async () => {
    const { store, state } = await loadComponentWithFixture("massive-resources");

    store.resetToState({
      ...state,
      monsters: [{
        currentTileId: state.tiles[0].id,
        stats: { dmg: 1, hp: 1},
        type: "Zombie"
      } as Monster],
      round: parseInt(Object.keys(wavesAtRounds)[0], 10) - 1
    });

    await executeSteps(store, false,
      (res) => {
        expect(res.monsters.length).toBe(1);
        store.dispatch(rollDice, res.tiles.length);
      },
      (res) => expect(res.monsters.length).toBeGreaterThan(1)
    );
  });
});
