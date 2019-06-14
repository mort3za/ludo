// tslint:disable: no-implicit-dependencies
import store from "@/store/index";
import { analyzeResult } from "@/functions/dice-helpers.ts";
import {
  MoveAction,
  DiceAnalization,
  Player,
  Marble,
  PositionInBoard,
  MoveType,
  StepPlace
} from "@/types/types";
import { getDistance, getPositionAfterMove, getStepsOfMoveAction } from "@/functions/path-helpers.ts";
import {
  getPositionOfMarble,
  getPositionOfStep,
  updateMarbleIsAtEnd,
  performOnGameOverActions,
  kickoutOtherMarbles,
  updateMarbleIsAtFinal,
  wait
} from "@/functions/general-helpers.ts";
import { MARBLE_ANIMATION_DURATION } from "@/constants.ts";

/**
 * Find all available moves
 */
export function getAvailableActions({
  player,
  diceResult
}: {
  player: Player;
  diceResult: number;
}): MoveAction[] {
  const availableActions: MoveAction[] = [];
  const diceAnalization = analyzeResult(diceResult);

  availableActions.push(..._getBenchActions(diceAnalization, player));
  availableActions.push(..._getInGameActions(diceAnalization, player));

  return availableActions;
}

/**
 * Choose best action through available actions
 */
export function chooseAction(actions: MoveAction[]): MoveAction {
  // TODO: implement logic
  return actions[0];
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
        to: getPositionOfStep(sideStartpointStep),
        type: MoveType.BENCH,
        marble
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
    const finalStepPosition: PositionInBoard = getPositionOfStep(store.getters["steps/finalStep"]);

    const distance: number = getDistance(marblePosition, finalStepPosition, player);
    // console.log("distance", distance);

    if (diceAnalization.value <= distance) {
      const action: MoveAction = {
        from: marblePosition,
        to: getPositionAfterMove({
          from: marblePosition,
          amount: diceAnalization.value,
          player
        }),
        type: MoveType.IN_GAME,
        marble
      };
      availableActions.push(action);
    }
  });
  return availableActions;
}

export function hasMultipleAvailableActions(actions: MoveAction[]): boolean {
  const benchMoveCount = actions.filter(action => action.type === MoveType.BENCH).length;
  const inGameMoveAcount = actions.filter(action => action.type === MoveType.IN_GAME).length;
  const total = inGameMoveAcount + (benchMoveCount > 0 ? 1 : 0);
  return total > 1;
}

export function canMove(marble: Marble, player: Player) {
  return marble.side === player.side && marble.isMoveable === true;
}

export async function moveStepByStep(moveAction: MoveAction): Promise<MoveAction> {
  const finalMarble = {
    ...moveAction.marble,
    isInGame: true,
    row: moveAction.to.row,
    column: moveAction.to.column,
    isMoving: false,
    isMoveable: false
  };
  
  const moveSteps: StepPlace[] = getStepsOfMoveAction(moveAction);
  for (const [index, step] of moveSteps.entries()) {
    const tempMarble: Marble = {
      ...moveAction.marble,
      isInGame: true,
      row: step[0],
      column: step[1],
      isMoving: true,
      isMoveable: false
    };
    await store.dispatch("marbles/update", tempMarble);
    if (index <= moveSteps.length - 2) {      
      await wait(MARBLE_ANIMATION_DURATION);
    }
  }
  await store.dispatch("marbles/update", finalMarble);

  const updatedMoveAction = {
    ...moveAction,
    marble: finalMarble
  };
  return updatedMoveAction;
}

export async function performAfterMoveActions(moveAction: MoveAction, player: Player) {
  // TODO: check isGameOver
  await updateMarbleIsAtEnd(moveAction.marble, player);
  await updateMarbleIsAtFinal(moveAction.marble, player);
  await performOnGameOverActions(player);
  await kickoutOtherMarbles(moveAction.marble, player);
}
