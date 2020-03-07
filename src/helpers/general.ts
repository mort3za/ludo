// @ts-ignore
import Toastify from 'toastify-js';

import {
  PositionInBoard,
  Marble,
  StepPlace,
  Player,
  MoveAction,
  MoveType,
  StepType,
  DiceInfo,
  StepPlaceProps
} from '@/types/types';
import { getPositionAfterMove } from '@/helpers';
import store from '@/store/index';

export function notify(options: any = {}) {
  if (!options.text) {
    console.log('No text');
    return;
  }
  Toastify({
    className: 'shadow',
    text: '',
    duration: 600000,
    // destination: undefined,
    // newWindow: false,
    // onClick: () => {}
    close: false,
    gravity: 'bottom', // `top` or `bottom`
    position: 'left', // `left`, `center` or `right`
    backgroundColor: 'white',
    stopOnFocus: true,
    ...options
  }).showToast();
}

// TODO: rename to isSamePosition
export function isSameStep(position1: PositionInBoard, position2: PositionInBoard): boolean {
  return position1.row === position2.row && position1.column === position2.column;
}

export function isSameStepPlace(step1: StepPlace, step2: StepPlace): boolean {
  return isSameStep(getPositionOfStep(step1), getPositionOfStep(step2));
}

export function getPositionOfStep(step: StepPlace): PositionInBoard {
  return {
    row: step[StepPlaceProps.ROW],
    column: step[StepPlaceProps.COLUMN]
  };
}

export function getPositionOfMarble(marble: Marble): PositionInBoard {
  return {
    row: marble.row,
    column: marble.column
  };
}

export function getStepPlaceOfMarble(marble: Marble): StepPlace {
  const position: PositionInBoard = getPositionOfMarble(marble);
  return getStepPlaceOfPosition(position);
}

export function getStepPlaceOfPosition(position: PositionInBoard): StepPlace {
  const stepPlace: StepPlace = store.getters['steps/getStepByPosition'](position);
  return stepPlace;
}

export function getMoveActionType(marble: Marble): MoveType {
  return marble.isInGame ? MoveType.IN_GAME : MoveType.BENCH;
}

export function createMoveAction({
  player,
  marble,
  diceInfo
}: {
  player: Player;
  marble: Marble;
  diceInfo: DiceInfo;
}): MoveAction {
  const type = getMoveActionType(marble);
  const from = getPositionOfMarble(marble);
  let to;
  if (type === MoveType.BENCH) {
    to = getPositionAfterMove({
      from,
      amount: 1,
      player
    });
  } else {
    to = getPositionAfterMove({
      from,
      amount: diceInfo.value,
      player
    });
  }
  return {
    marble,
    type,
    from,
    to
  };
}

export async function wait(time: number) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}

export function isPositionAtEnd(position: PositionInBoard, player: Player) {
  const playerEndPoints = store.getters['steps/sideEndpoints'](player);
  return playerEndPoints.some((endPointStep: StepPlace) => {
    return isSameStep(position, getPositionOfStep(endPointStep));
  });
}

export function isPositionAtFinal(position: PositionInBoard) {
  const finishPosition = getPositionOfStep(store.getters['steps/finalStep']);
  return isSameStep(position, finishPosition);
}

/**
 * set isAtEnd attribute of marble based on current position of marble
 */
export async function updateMarbleIsAtEnd(marble: Marble, player: Player) {
  const isAtEnd = isPositionAtEnd(getPositionOfMarble(marble), player);
  await store.dispatch('marbles/update', {
    ...marble,
    isAtEnd
  });
}

export async function updateMarbleIsAtFinal(marble: Marble) {
  const isAtFinal = isPositionAtFinal(getPositionOfMarble(marble));
  if (isAtFinal) {
    return store.dispatch('marbles/updateSomeProps', { marble, props: { isAtFinal } });
  }
  return Promise.resolve();
}

export async function performOnGameOverActions(player: Player) {
  // TODO:
}

export function getKickoutList(player: Player, targetPosition: PositionInBoard): Marble[] {
  const otherMarblesAtStepPlace = store.getters['marbles/listOtherPlayersMarblesByPosition'](player, targetPosition);
  const gamePlay = store.getters['settings/gamePlay'];
  return otherMarblesAtStepPlace.filter((m: Marble) => {
    const stepPlace: StepPlace = getStepPlaceOfMarble(m);
    let preventKickout = false;
    if (gamePlay.isSafezonesEnabled) {
      preventKickout = preventKickout || stepPlace[StepPlaceProps.STEP_TYPE].includes(StepType.SAFEZONE);
    }
    preventKickout = preventKickout || stepPlace[StepPlaceProps.STEP_TYPE].includes(StepType.FINAL);
    return !preventKickout;
  });
}

export async function kickoutOtherMarbles(marble: Marble, player: Player) {
  const kickoutList = getKickoutList(player, getPositionOfMarble(marble));
  for (const m1 of kickoutList) {
    const marbleInitial = getInitialStateOfMarble(m1);
    // FIXME: for debugging only:
    // marbleInitial.row = 1;
    await store.dispatch('marbles/update', marbleInitial);
  }
}

export function getInitialStateOfMarble(marble: Marble): Marble {
  const marblesListInitial = store.getters['marbles/listInitial'];
  return marblesListInitial.find((m: Marble) => marble.id === m.id);
}
