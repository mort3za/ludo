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
  StepPlace,
  BoardStatus,
  StepType
} from "@/types/types";
import { getDistance, getPositionAfterMove, getStepsOfMoveAction } from "@/functions/path-helpers.ts";
import {
  getPositionOfMarble,
  getPositionOfStep,
  updateMarbleIsAtEnd,
  performOnGameOverActions,
  kickoutOtherMarbles,
  updateMarbleIsAtFinal,
  wait,
  getKickoutList,
  getStepPlaceOfPosition
} from "@/functions/general-helpers.ts";
import { MARBLE_ANIMATION_DURATION, SLEEP_BETWEEN_MOVES, PATH_STEPS_COUNT } from "@/constants.ts";
import { cloneDeep, maxBy } from "lodash-es";

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
 *  Adds strategical information to a MoveAction object
 */
export function getStrategicalAction(action: MoveAction, player: Player): MoveAction {
  const finalStepPosition: PositionInBoard = getPositionOfStep(store.getters["steps/finalStep"]);
  const upgradedAction = cloneDeep(action);

  upgradedAction.distanceToFinal = getDistance(action.to, finalStepPosition, player);
  upgradedAction.kickoutList = getKickoutList(player, action.to);
  upgradedAction.isCurrentPositionSafepoint = getStepPlaceOfPosition(action.from)[3] === StepType.SAFEZONE;
  upgradedAction.isTargetPositionSafepoint = getStepPlaceOfPosition(action.to)[3] === StepType.SAFEZONE;
  return upgradedAction;
}

/**
 * A list of qualities needed to take a decition to choose an action
 */
const ActionQualityList = {
  currentSafepoint() {
    const gamePlay = store.getters["settings/gamePlay"];
    return gamePlay.isSafezonesEnabled ? -2 : 0;
  },
  targetSafepoint() {
    const gamePlay = store.getters["settings/gamePlay"];
    return gamePlay.isSafezonesEnabled ? 4 : 0;
  },
  benchOut: 5,
  stayBehindOthers(action: MoveAction) {
    if ((action.kickoutList || []).length > 0) {
      return 0;
    }
    // TODO: implement
    // target: count of behind, count of front
    // current: count of behind, count of front
    return 0;
  },
  kickout(action: MoveAction) {
    if (action.isTargetPositionSafepoint) {
      return 0;
    }
    return 10;
  },
  distanceFinal(distance: number = PATH_STEPS_COUNT) {
    return (PATH_STEPS_COUNT - distance) / PATH_STEPS_COUNT;
  }
};

/**
 * Calculate sum of qualities of an action
 */
export function getActionQuality(action: MoveAction): number {
  let quality = 0;
  quality += (action.kickoutList || []).length * ActionQualityList.kickout(action);
  quality += action.marble.isInGame ? ActionQualityList.benchOut : 0;
  quality += ActionQualityList.distanceFinal(action.distanceToFinal);
  quality += action.isTargetPositionSafepoint ? ActionQualityList.targetSafepoint() : 0;
  quality += action.isCurrentPositionSafepoint ? ActionQualityList.currentSafepoint() : 0;
  return quality;
}

/**
 * Choose best action through available actions
 */
export function chooseAction(actions: MoveAction[], player: Player): MoveAction {
  const upgradedActions: MoveAction[] = [];

  actions.forEach(action => {
    const upgradedAction = getStrategicalAction(action, player);
    upgradedAction.quality = getActionQuality(upgradedAction);
    upgradedActions.push(upgradedAction);
  });

  console.log("upgradedActions", upgradedActions, `player ${upgradedActions[0].marble.side}`);
  // @ts-ignore
  return maxBy(upgradedActions, "quality");
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

/**
 * Break a move into one step moves and perform them one by one
 */
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
    // dont run on last
    if (index <= moveSteps.length - 2) {
      await wait(SLEEP_BETWEEN_MOVES);
    }
  }
  await store.dispatch("marbles/update", finalMarble);

  const updatedMoveAction = {
    ...moveAction,
    marble: finalMarble
  };
  return updatedMoveAction;
}

export async function beforeMoveActions(moveAction: MoveAction, player: Player) {
  await store.dispatch("marbles/unsetMoveableAll");
  store.dispatch("updateBoardStatus", BoardStatus.MOVING_MARBLES);
}

export async function afterMoveActions(moveAction: MoveAction, player: Player) {
  // TODO: check isGameOver
  await updateMarbleIsAtEnd(moveAction.marble, player);
  await updateMarbleIsAtFinal(moveAction.marble, player);
  await performOnGameOverActions(player);
  await kickoutOtherMarbles(moveAction.marble, player);
  await wait(MARBLE_ANIMATION_DURATION);
}
