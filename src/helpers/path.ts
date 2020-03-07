import store from '@/store/index';
import { StepPlace, PositionInBoard, Player, MoveAction, StepPlaceProps } from '@/types/types';
import { isSameStep, getPositionOfStep } from '@/helpers';

export function getDistance(position1: PositionInBoard, position2: PositionInBoard, player: Player): number {
  const playerPath = store.getters['steps/allPaths'](player);
  const index1 = playerPath.findIndex((step: StepPlace) => isSameStep(getPositionOfStep(step), position1));
  const index2 = playerPath.findIndex((step: StepPlace) => isSameStep(getPositionOfStep(step), position2));
  // console.log("distance", index2 - index1);
  return index2 - index1;
}

export function getPositionAfterMove({
  from,
  amount,
  player
}: {
  from: PositionInBoard;
  amount: number;
  player: Player;
}): PositionInBoard {
  const playerPath = store.getters['steps/allPaths'](player);
  const positionIndex = playerPath.findIndex((step: StepPlace) => {
    return step[StepPlaceProps.ROW] === from.row && step[StepPlaceProps.COLUMN] === from.column;
  });

  if (playerPath.length >= positionIndex + amount) {
    const step = playerPath[positionIndex + amount];
    return getPositionOfStep(step);
  }
  throw Error('Out of path range');
}

export function getStepsOfMoveAction(moveAction: MoveAction): StepPlace[] {
  const playerPath: StepPlace[] = store.getters['steps/allPaths']({ side: moveAction.marble.side });
  const index1 = playerPath.findIndex((step: StepPlace) => isSameStep(getPositionOfStep(step), moveAction.from));

  const index2 = playerPath.findIndex((step: StepPlace) => isSameStep(getPositionOfStep(step), moveAction.to));

  return playerPath.slice(index1 + 1, index2 + 1);
}
