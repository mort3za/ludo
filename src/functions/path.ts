import store from "@/store/index";
import { StepPlace, PositionInBoard } from "@/types/types";

export function getDistance(position1: PositionInBoard, position2: PositionInBoard): number {
  const allSteps = store.getters["steps/allSteps"];
  const index1 = allSteps.findIndex(
    (step: StepPlace) => step[0] === position1.row && step[1] === position1.column
  );
  const index2 = allSteps.findIndex(
    (step: StepPlace) => step[0] === position2.row && step[1] === position2.column
  );
  return index2 - index1;
}

// export function getPositionInPath(marble, player) {
//   const sidePath = store.getters["steps/allPaths"]({ side: player.side });
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
