// tslint:disable: no-implicit-dependencies
import store from '@/store/index';
import {
  MoveAction,
  Player,
  Marble,
  PositionInBoard,
  MoveType,
  StepPlace,
  BoardStatus,
  StepType,
  DiceInfo,
  StepPlaceProps
} from '@/types/types';
import { getDistance, getPositionAfterMove, getStepsOfMoveAction } from '@/helpers';
import {
  getPositionOfMarble,
  getPositionOfStep,
  updateMarbleIsAtEnd,
  performOnGameOverActions,
  kickoutOtherMarbles,
  updateMarbleIsAtFinal,
  wait,
  getKickoutList,
  getStepPlaceOfPosition,
  getInitialStateOfMarble,
  getStepPlaceOfMarble
} from '@/helpers';
import { MARBLE_ANIMATION_DURATION, SLEEP_BETWEEN_MOVES, PATH_STEPS_COUNT } from '@/constants.ts';
import { cloneDeep, maxBy } from 'lodash-es';
import { setDiceAsDone } from './dice';

/**
 * Find all available moves
 */
export function getAvailableActions({ player, diceInfo }: { player: Player; diceInfo: DiceInfo }): MoveAction[] {
  const availableActions: MoveAction[] = [];

  availableActions.push(..._getBenchActions(diceInfo, player));
  availableActions.push(..._getInGameActions(diceInfo, player));

  return availableActions;
}

/**
 *  Adds strategical information to a MoveAction object
 */
export function getStrategicalAction(action: MoveAction, player: Player): MoveAction {
  const finalStepPosition: PositionInBoard = getPositionOfStep(store.getters['steps/finalStep']);
  const upgradedAction = cloneDeep(action);

  upgradedAction.distanceToFinal = getDistance(action.to, finalStepPosition, player);
  upgradedAction.kickoutList = getKickoutList(player, action.to);
  upgradedAction.isCurrentPositionSafepoint = getStepPlaceOfPosition(action.from)[StepPlaceProps.STEP_TYPE].includes(
    StepType.SAFEZONE
  );
  upgradedAction.isTargetPositionSafepoint = getStepPlaceOfPosition(action.to)[StepPlaceProps.STEP_TYPE].includes(
    StepType.SAFEZONE
  );
  return upgradedAction;
}

/**
 * A list of qualities needed to take a decition to choose an action
 */
const ActionQualityList = {
  currentSafepoint() {
    const gamePlay = store.getters['settings/gamePlay'];
    return gamePlay.isSafezonesEnabled ? -2 : 0;
  },
  targetSafepoint() {
    const gamePlay = store.getters['settings/gamePlay'];
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
  // console.log("upgradedActions", upgradedActions, `player ${upgradedActions[0].marble.side}`);

  // @ts-ignore
  return maxBy(upgradedActions, 'quality');
}

function _getBenchActions(diceInfo: DiceInfo, player: Player): MoveAction[] {
  const availableActions: MoveAction[] = [];
  const playerMarblesInBench = store.getters['marbles/listInBenchByPlayer'](player);
  const hasAnyBenchMarbles = playerMarblesInBench.length > 0;

  // prevent move to filled step
  const startpointStep = store.getters['steps/sideStartpoint'](player);
  const playerMarblesAtStartpoint = store.getters['marbles/listPlayerMarblesByPosition'](
    player,
    getPositionOfStep(startpointStep)
  );
  const startpointIsFilled = playerMarblesAtStartpoint.length > 0;
  if (!hasAnyBenchMarbles || startpointIsFilled) {
    return availableActions;
  }

  if (diceInfo.canMoveBench) {
    const sideStartpointStep = store.getters['steps/sideStartpoint'](player);
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

function _getInGameActions(diceInfo: DiceInfo, player: Player): MoveAction[] {
  const availableActions: MoveAction[] = [];
  const playerMarblesInGame = store.getters['marbles/listInGameByPlayer'](player);

  playerMarblesInGame.forEach((marble: Marble) => {
    const marblePosition: PositionInBoard = getPositionOfMarble(marble);
    const finalStepPosition: PositionInBoard = getPositionOfStep(store.getters['steps/finalStep']);
    const distanceToFinal: number = getDistance(marblePosition, finalStepPosition, player);
    const isOutOfPath: boolean = diceInfo.value <= distanceToFinal;

    if (!isOutOfPath) {
      return;
    }

    const toPosition: PositionInBoard = getPositionAfterMove({ from: marblePosition, player, amount: diceInfo.value });

    // prevent move to filled step
    const playerMarblesAtToPosition = store.getters['marbles/listPlayerMarblesByPosition'](player, toPosition);
    const isToPositionFinal = getStepPlaceOfPosition(toPosition)[StepPlaceProps.STEP_TYPE].includes(StepType.FINAL);
    const toPositionIsFilled = playerMarblesAtToPosition.length > 0;
    if (!isToPositionFinal && toPositionIsFilled) {
      return;
    }

    const action: MoveAction = {
      from: marblePosition,
      to: getPositionAfterMove({
        from: marblePosition,
        amount: diceInfo.value,
        player
      }),
      type: MoveType.IN_GAME,
      marble
    };
    availableActions.push(action);
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
      row: step[StepPlaceProps.ROW],
      column: step[StepPlaceProps.COLUMN],
      isMoving: true,
      isMoveable: false
    };
    await store.dispatch('marbles/update', tempMarble);
    // dont run on last
    if (index <= moveSteps.length - 2) {
      await wait(SLEEP_BETWEEN_MOVES);
    }
  }
  await store.dispatch('marbles/update', finalMarble);

  const updatedMoveAction = {
    ...moveAction,
    marble: finalMarble
  };
  return updatedMoveAction;
}

export async function goToHeaven(marbleId: number) {
  // marble is not updated here, should get fresh one
  const freshMarble = store.getters['marbles/itemById'](marbleId);
  if (!freshMarble.isAtFinal) {
    return;
  }

  wait(MARBLE_ANIMATION_DURATION);
  const initialMarble = getInitialStateOfMarble(freshMarble);
  const initialStepPlaceOfMarble: StepPlace = getStepPlaceOfMarble(initialMarble);
  store.dispatch('steps/updateSomeProps', { step: initialStepPlaceOfMarble, setType: StepType.BENCH_DONE });
}

export async function beforeMoveActions(moveAction: MoveAction, player: Player) {
  await store.dispatch('marbles/unsetMoveableAll');
  store.dispatch('board/update', {
    key: 'boardStatus',
    value: BoardStatus.MOVING_MARBLES
  });
}

function _saveGame(reason: string) {
  store.dispatch('saveGame');
  // console.log("save game...", reason);
}

export async function afterFinishTurn() {
  await setDiceAsDone();
  _saveGame('turn finished');
  await wait(MARBLE_ANIMATION_DURATION);
}

export async function afterMoveActions(moveAction: MoveAction, player: Player) {
  await updateMarbleIsAtEnd(moveAction.marble, player);
  await updateMarbleIsAtFinal(moveAction.marble);
  await goToHeaven(moveAction.marble.id);
  await performOnGameOverActions(player);
  await kickoutOtherMarbles(moveAction.marble, player);
}
