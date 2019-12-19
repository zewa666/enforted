import { State } from "../index";
import { Tile } from "../../board/tile";

export function rollDice(state: State): State {
  const idxOfTile = state.tiles.indexOf(state.players[0].currentTile);
  const roll = Math.floor(Math.random() * (6 - 1)) + 1;
  const newPosition = idxOfTile + roll;

  return {
    ...state,
    lastDiceRoll: roll,
    turn: newPosition > state.tiles.length - 1
      ? state.turn + 1
      : state.turn,
    players: [
      { ...state.players[0],
        currentTile: newPosition > state.tiles.length - 1
          ? state.tiles[Math.abs(newPosition - state.tiles.length)]
          : state.tiles[newPosition]
      }
    ]
  };
}


export function openPurchaseForTile(state: State, tile: Tile): State {
  return {
    ...state,
    purchaseInProgress: tile.id
  };
}
