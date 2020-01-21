import { TileBuilding } from "../../src/buildings/tile-building";
import { Player } from "../../src/player/player";
import { PRODUCED_RESOURCES_PER_ROUND, rollDice, State } from "../../src/store/index";
import { stageBoard } from "../staged-helper";

describe("Shrines", () => {
  const staged = stageBoard.bind(this)(beforeEach, afterEach);
  const loadComponentWithFixture = staged.loadComponentWithFixture.bind(this);

  function generateShrines(state: State): TileBuilding[] {
    return state.tiles.filter((t) => t.type === "sacred_grounds")
      .map((t) => ({
        placement: t.placement,
        tileId: t.id,
        type: "shrine"
      } as TileBuilding));
  }

  it("should yield +1 gold for a single shrine every round", async () => {
    const { state, store } = await loadComponentWithFixture("no-resources");

    // move the position to last tile
    store.resetToState({
      ...state,
      players: [
        {
          ...state.players[0],
          currentTileId: state.tiles[state.tiles.length - 1].id
        } as Player
      ],
      tileBuildings: [
        generateShrines(state)[0]
      ]
    });

    await store.dispatch(rollDice);

    const newState = (store as any)._state.getValue() as State;
    expect(newState.resources.gold).toBe(1);
  });

  it("should yield additionally +1 mana for 2 shrines every round", async () => {
    const { state, store } = await loadComponentWithFixture("no-resources");

    // move the position to last tile
    store.resetToState({
      ...state,
      players: [
        {
          ...state.players[0],
          currentTileId: state.tiles[state.tiles.length - 1].id
        } as Player
      ],
      tileBuildings: generateShrines(state).slice(0, 2)
    });

    await store.dispatch(rollDice);

    const newState = (store as any)._state.getValue() as State;
    expect(newState.resources).toEqual(expect.objectContaining({
      gold: 1,
      mana: 1
    }));
  });

  it("should yield additionally +1 blood for 3 shrines every round", async () => {
    const { state, store } = await loadComponentWithFixture("no-resources");

    // move the position to last tile
    store.resetToState({
      ...state,
      players: [
        {
          ...state.players[0],
          currentTileId: state.tiles[state.tiles.length - 1].id
        } as Player
      ],
      tileBuildings: generateShrines(state).slice(0, 3)
    });

    await store.dispatch(rollDice);

    const newState = (store as any)._state.getValue() as State;
    expect(newState.resources).toEqual(expect.objectContaining({
      blood: 1,
      gold: 1,
      mana: 1,
    }));
  });

  it("should yield additionally +1 for all producing tile-buildings for 4 shrines every round", async () => {
    const { state, store } = await loadComponentWithFixture("no-resources");

    // move the position to last tile
    store.resetToState({
      ...state,
      players: [
        {
          ...state.players[0],
          currentTileId: state.tiles[state.tiles.length - 1].id
        } as Player
      ],
      tileBuildings: [
        ...generateShrines(state),
        {
          placement: state.tiles[1].placement,
          tileId: state.tiles[1].id,
          type: "sawmill"
        } as TileBuilding
      ]
    });

    await store.dispatch(rollDice);

    const newState = (store as any)._state.getValue() as State;
    expect(newState.resources).toEqual(expect.objectContaining({
      blood: 1,
      gold: 1,
      mana: 1,
      wood: PRODUCED_RESOURCES_PER_ROUND + 1
    }));
  });
});
