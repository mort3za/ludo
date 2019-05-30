import store from "@/store/index";

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