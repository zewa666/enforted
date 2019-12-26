import { bootstrap } from "aurelia-bootstrapper";
import { PLATFORM } from "aurelia-pal";
import { Store } from "aurelia-store";
import { ComponentTester, StageComponent } from "aurelia-testing";

import { TileBuilding } from "../../src/buildings/tile-building";
import { Player } from "../../src/player/player";
import { LOCALSTORAGE_SAVE_KEY, PRODUCED_RESOURCES_PER_ROUND, rollDice, State } from "../../src/store/index";

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
      store: component.viewModel.store as Store<State>,
      view: component.element,
      vm: component.viewModel,
    };
  }

  function generateShrines(state: State): TileBuilding[] {
    return state.tiles.filter((t) => t.type === "sacred_grounds")
      .map((t) => ({
        placement: t.placement,
        tileId: t.id,
        type: "shrine"
      }));
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
        }
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
