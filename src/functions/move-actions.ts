// tslint:disable-next-line
import store from "@/store/index";
import { analyzeResult } from "./dice";

export function getAvailableActions({ player, diceResult }: { player: Player; diceResult: number }) {
  const availableActions: MoveAction[] = [];
  const diceAnalization = analyzeResult(diceResult);

  // bench action
  if (diceAnalization.canMoveBench) {
    const action: MoveAction = {
      from: { row: -1, column: -1 },
      to: { row: 0, column: 0 }
    };
    availableActions.push(action);
  }

  // inGame actions
  const playerMarblesInGame = store.getters["marbles/listInGameByPlayer"](player);
  console.log("playerMarblesInGame", playerMarblesInGame);
  return availableActions;
}

export function prepareMoveMarble({ player, diceResult }: { player: Player; diceResult: number }) {
  console.log("prepareMoveMarble --- side:", player.side);
  const marbles = store.getters["marbles/list"];
  const playerMarbles = store.getters["marbles/listByPlayer"](player);
  // const playerPath = store.getters["steps/allPaths"]({ side: player.side });

  console.log("marbles", marbles);
  console.log("playerMarbles", playerMarbles);
  return {
    // shouldWaitForAction
  };
}
