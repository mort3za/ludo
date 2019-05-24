import store from "@/store/index.ts";

interface Person {}

export function generateSteps() {
  let steps = [];
  for (let i = 1; i <= 14; i++) {
    const type = _getStepType(i);
    steps.push({
      side: 1,
      type,
      row: store.getters["steps/sideSteps"]({ side: 1 })[i - 1][0],
      column: store.getters["steps/sideSteps"]({ side: 1 })[i - 1][1]
    });
    steps.push({
      side: 2,
      type,
      row: store.getters["steps/sideSteps"]({ side: 2 })[i - 1][0],
      column: store.getters["steps/sideSteps"]({ side: 2 })[i - 1][1]
    });
    steps.push({
      side: 3,
      type,
      row: store.getters["steps/sideSteps"]({ side: 3 })[i - 1][0],
      column: store.getters["steps/sideSteps"]({ side: 3 })[i - 1][1]
    });
    steps.push({
      side: 4,
      type,
      row: store.getters["steps/sideSteps"]({ side: 4 })[i - 1][0],
      column: store.getters["steps/sideSteps"]({ side: 4 })[i - 1][1]
    });
  }
  for (let i = 1; i <= 4; i++) {
    steps.push({
      side: 1,
      type: "bench",
      row: store.getters["steps/sideBenchs"]({ side: 1 })[i - 1][0],
      column: store.getters["steps/sideBenchs"]({ side: 1 })[i - 1][1]
    });
    steps.push({
      side: 2,
      type: "bench",
      row: store.getters["steps/sideBenchs"]({ side: 2 })[i - 1][0],
      column: store.getters["steps/sideBenchs"]({ side: 2 })[i - 1][1]
    });
    steps.push({
      side: 3,
      type: "bench",
      row: store.getters["steps/sideBenchs"]({ side: 3 })[i - 1][0],
      column: store.getters["steps/sideBenchs"]({ side: 3 })[i - 1][1]
    });
    steps.push({
      side: 4,
      type: "bench",
      row: store.getters["steps/sideBenchs"]({ side: 4 })[i - 1][0],
      column: store.getters["steps/sideBenchs"]({ side: 4 })[i - 1][1]
    });
  }
  steps.push();
  return steps;
}

function _getStepType(index) {
  if (index >= 2 && index <= 10) {
    return "normal";
  } else if (index > 10) {
    return "endpoint";
  } else if (index === 1) {
    return "startpoint";
  }
}

// eslint-disable-next-line no-unused-vars
function getPositionInPathFromAnotherPlayerSight(playerFrom, playerTo, positionInPath) {
  if (positionInPath >= 40) {
    // isn't in playerTo's path
    return NaN;
  }
  const sideDifference = (4 - (playerTo.side - playerFrom.side)) % 4;
  return positionInPath + sideDifference * 10;
}

function getDistance(position1, position2) {}

function analyzeDiceResult(diceResult) {
  const isSix = diceResult === 6;
  return {
    canMoveBench: isSix,
    hasReward: isSix
  };
}

export function getAvailableActions({ player, diceResult }) {
  let availableActions = [];
  const diceAnalization = analyzeDiceResult(diceResult);

  // bench action
  if (diceAnalization.canMoveBench) {
    availableActions.push({
      from: -1,
      to: 0
    });
  }

  // inGame actions
  const playerMarblesInGame = store.getters["marbles/listInGameByPlayer"](player);
  console.log("playerMarblesInGame", playerMarblesInGame);
  return availableActions;
}

function getPositionInPath(marble, player) {
  const sidePath = store.getters["steps/allPaths"]({ side: player.side });
  // console.log("sidePath", sidePath);
  sidePath.forEach(step => {
    console.log("step, marble", step, marble);
    if (step[0] === marble.row && step[1] === marble.column) {
      return step;
    }
  });
  return null;
}

export function prepareMoveMarble({ player, diceResult }) {
  console.log("prepareMoveMarble --- side:", player.side);
  const marbles = store.getters["marbles/list"];
  const playerMarbles = store.getters["marbles/listByPlayer"](player);
  // const playerPath = store.getters["steps/allPaths"]({ side: player.side });

  console.log("marbles", marbles);
  console.log("playerMarbles", playerMarbles);
  return {
    // shouldWaitForAction
  };
}
