import store from "@/store/index";
import { analyzeResult } from "./dice";
import { MoveAction, DiceAnalization, Player, Marble, PositionInBoard } from "@/types/types";
import { getDistance, getPositionOfMarble, getPositionAfterMove, getPositionOfStep } from "./path";

export function getAvailableActions({ player, diceResult }: { player: Player; diceResult: number }) {
  const availableActions: MoveAction[] = [];
  const diceAnalization = analyzeResult(diceResult);

  availableActions.push(..._getBenchActions(diceAnalization, player));
  availableActions.push(..._getInGameActions(diceAnalization, player));
  console.log("availableActions", availableActions);

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
    const sideStartpointStep = store.getters["steps/sideStartpoint"](player);
    playerMarblesInBench.forEach((marble: Marble) => {
      const action: MoveAction = {
        from: getPositionOfMarble(marble),
        to: getPositionOfStep(sideStartpointStep)
      };
      availableActions.push(action);
    });
  }
  return availableActions;
}

function _getInGameActions(diceAnalization: DiceAnalization, player: Player): MoveAction[] {
  const availableActions: MoveAction[] = [];
  const playerMarblesInGame = store.getters["marbles/listInGameByPlayer"](player);

  playerMarblesInGame.forEach((marble: Marble) => {
    const marblePosition: PositionInBoard = getPositionOfMarble(marble);
    const lastStepPosition: PositionInBoard = getPositionOfStep(store.getters["steps/sideLastpoint"](player));

    const distance: number = getDistance(marblePosition, lastStepPosition, player);
    console.log("distance", distance);

    if (diceAnalization.value <= distance) {
      const action: MoveAction = {
        from: marblePosition,
        to: getPositionAfterMove({
          position: marblePosition,
          amount: diceAnalization.value,
          player
        })
      };
      availableActions.push(action);
    }
  });
  return availableActions;
}

export function prepareMoveMarble({ player, diceResult }: { player: Player; diceResult: number }) {
  // console.log("prepareMoveMarble --- side:", player.side);
  const marbles = store.getters["marbles/list"];
  const playerMarbles = store.getters["marbles/listByPlayer"](player);
  // const playerPath = store.getters["steps/allPaths"]({ side: player.side });

  // console.log("marbles", marbles);
  // console.log("playerMarbles", playerMarbles);
  return {
    // shouldWaitForAction
  };
}
