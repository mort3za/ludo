import store from "@/store/index";
import { StepPlace, PositionInBoard, Marble, Player } from "@/types/types";

export function isSameStep(position1: PositionInBoard, position2: PositionInBoard) {
  return position1.row === position2.row && position1.column === position2.column;
}

export function getDistance(position1: PositionInBoard, position2: PositionInBoard, player: Player): number {
  const playerPath = store.getters["steps/allPaths"](player);
  const index1 = playerPath.findIndex((step: StepPlace) =>
    isSameStep({ row: step[0], column: step[1] }, position1)
  );

  const index2 = playerPath.findIndex((step: StepPlace) =>
    isSameStep({ row: step[0], column: step[1] }, position2)
  );
  return index2 - index1;
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

export function getPositionAfterMove({
  position,
  amount,
  player
}: {
  position: PositionInBoard;
  amount: number;
  player: Player;
}): PositionInBoard {
  const playerPath = store.getters["steps/allPaths"](player);
  const positionIndex = playerPath.findIndex((step: StepPlace) => {
    return step[0] === position.row && step[1] === position.column;
  });
  // console.log("playerPath", playerPath);
  // console.log("positionIndex", positionIndex);

  if (playerPath.length >= positionIndex + amount) {
    const step = playerPath[positionIndex + amount];
    return getPositionOfStep(step);
  }
  throw Error("Out of path range");
}

// export function getPositionInPath(marble, player) {
//   const sidePath = store.getters["steps/allPaths"](player);
//   // console.log("sidePath", sidePath);
//   sidePath.forEach(step => {
//     console.log("step, marble", step, marble);
//     if (step[0] === marble.row && step[1] === marble.column) {
//       return step;
//     }
//   });
//   return null;
// }

// function getPositionInPathFromAnotherPlayerSight(playerFrom, playerTo, positionInPath) {
//   if (positionInPath >= 40) {
//     // isn't in playerTo's path
//     return NaN;
//   }
//   const sideDifference = (4 - (playerTo.side - playerFrom.side)) % 4;
//   return positionInPath + sideDifference * 10;
// }
