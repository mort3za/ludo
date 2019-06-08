import { PositionInBoard, Marble, StepPlace, Player, MoveAction, MoveType, StepType } from "./types/types";
import { getPositionAfterMove } from "./functions/path";
import store from "@/store/index";
import marbles from "./store/modules/marbles";

export function isSameStep(position1: PositionInBoard, position2: PositionInBoard) {
  return position1.row === position2.row && position1.column === position2.column;
}

export function getPositionOfStep(step: StepPlace): PositionInBoard {
  return {
    row: step[0],
    column: step[1]
  };
}

export function getPositionOfMarble(marble: Marble): PositionInBoard {
  return {
    row: marble.row,
    column: marble.column
  };
}

export function getStepPlaceOfMarble(marble: Marble): StepType[] {
  const position: PositionInBoard = getPositionOfMarble(marble);
  const stepPlace: StepPlace = store.getters["steps/getStepByPosition"](position);
  return stepPlace[3];
}

export function getMoveActionType(marble: Marble): MoveType {
  return marble.isInGame ? MoveType.IN_GAME : MoveType.BENCH;
}

export function createMoveAction({
  player,
  marble,
  diceResult
}: {
  player: Player;
  marble: Marble;
  diceResult: number;
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
      amount: diceResult,
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
  const playerEndPoints = store.getters["steps/sideEndpoints"](player);
  return playerEndPoints.some((endPointStep: StepPlace) => {
    return isSameStep(position, getPositionOfStep(endPointStep));
  });
}

/**
 * set isAtEnd attribute of marble based on current position of marble
 */
export async function updateMarbleIsAtEnd(marble: Marble, player: Player) {
  const isAtEnd = isPositionAtEnd(getPositionOfMarble(marble), player);
  await store.dispatch("marbles/update", {
    ...marble,
    isAtEnd
  });
}

export async function performOnGameOverActions(player: Player) {
  // TODO:
}

export async function kickoutOtherMarbles(marble: Marble, player: Player) {
  const otherMarblesAtStepPlace = store.getters["marbles/listOtherPlayersMarblesByPosition"](
    player,
    getPositionOfMarble(marble)
  );
  const kickoutList = otherMarblesAtStepPlace.filter((m: Marble) => {
    const stepTypes: StepType[] = getStepPlaceOfMarble(m);
    const shouldKickout = !stepTypes.includes(StepType.SAFEZONE);
    return shouldKickout;
  });

  const marblesListInitial = store.getters["marbles/listInitial"];
  for (const m1 of kickoutList) {
    const marbleInitial = marblesListInitial.find((m2: Marble) => m1.id === m2.id);
    await store.dispatch("marbles/update", marbleInitial);
  }
}
