import store from "@/store/index";
import { analyzeResult } from "./dice";
import { MoveAction, DiceAnalization, Player } from "@/types/types";

export function getAvailableActions({ player, diceResult }: { player: Player; diceResult: number }) {
  const availableActions: MoveAction[] = [];
  const diceAnalization = analyzeResult(diceResult);

  availableActions.push(..._getBenchActions(diceAnalization, player));
  availableActions.push(..._getInGameActions(diceAnalization, player));

  return availableActions;
}

function _getBenchActions(diceAnalization: DiceAnalization, player: Player): MoveAction[] {
  const availableActions: MoveAction[] = [];
  const playerMarblesInBench = store.getters["marbles/listInBenchByPlayer"](player);
  const hasAnyBenchMarbles = playerMarblesInBench.length > 0;
  if (!hasAnyBenchMarbles) {
    return availableActions;
  }
  if (diceAnalization.canMoveBench) {
    const action: MoveAction = {
      from: { row: -1, column: -1 },
      to: { row: 0, column: 0 }
    };
    availableActions.push(action);
  }
  return availableActions;
}

function _getInGameActions(diceAnalization: DiceAnalization, player: Player): MoveAction {
  const availableActions: MoveAction = [];
  const playerMarblesInGame = store.getters["marbles/listInGameByPlayer"](player);
  // playerMarblesInGame.forEach(marble => {

  // });
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