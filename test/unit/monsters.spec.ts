import { executeSteps } from "aurelia-store";

import { Monster } from "../../src/monster/monster";
import { rollDice } from "../../src/store/index";
import { stageBoard } from "../staged-helper";

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
          currentTileId: state.tiles.find((t) => t.type === "sacred_grounds").id
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
});
