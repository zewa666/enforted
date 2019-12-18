import { State } from "../index";

export function rollDice(state: State): State {
  const idxOfTile = state.tiles.indexOf(state.players[0].currentTile);
  const roll = Math.floor(Math.random() * (6 - 1)) + 1;
  const newPosition = idxOfTile + roll;

  return {
    ...state,
    lastDiceRoll: roll,
    players: [
      { ...state.players[0],
        currentTile: newPosition > state.tiles.length - 1
          ? state.tiles[Math.abs(newPosition - state.tiles.length)]
          : state.tiles[newPosition]
      }
    ]
  };
}
