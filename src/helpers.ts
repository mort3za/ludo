import { PositionInBoard, Marble, StepPlace, Player, MoveAction, MoveType } from "./types/types";
import { getPositionAfterMove } from "./functions/path";

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
  const from = getPositionOfMarble(marble);
  const to = getPositionAfterMove({
    from,
    amount: diceResult,
    player
  });
  return {
    marble,
    type: getMoveActionType(marble),
    from,
    to
  };
}
