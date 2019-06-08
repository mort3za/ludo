/*
Sides of game board:

        -------------------
bench 2          |          bench 3
          side 2 | side 3
                 |
        -------------------
                 |
          side 1 | side 4
bench 1          |          bench 4
        -------------------

Every step is in [row, column, side, step type] format
*/

import { StepType, Player, StepPlace, PositionInBoard } from "@/types/types";

export default {
  namespaced: true,
  state: {
    list: [
      // side 1
      [10, 1, 1, [StepType.BENCH]],
      [10, 2, 1, [StepType.BENCH]],
      [11, 1, 1, [StepType.BENCH]],
      [11, 2, 1, [StepType.BENCH]],
      [11, 5, 1, [StepType.COMMON, StepType.STARTPOINT, StepType.SAFEZONE]],
      [10, 5, 1, [StepType.COMMON]],
      [9, 5, 1, [StepType.COMMON]],
      [8, 5, 1, [StepType.COMMON]],
      [7, 5, 1, [StepType.COMMON]],
      [7, 4, 1, [StepType.COMMON]],
      [7, 3, 1, [StepType.COMMON]],
      [7, 2, 1, [StepType.COMMON]],
      [7, 1, 1, [StepType.COMMON]],
      [6, 1, 1, [StepType.COMMON]],
      [10, 6, 1, [StepType.ENDPOINT]],
      [9, 6, 1, [StepType.ENDPOINT]],
      [8, 6, 1, [StepType.ENDPOINT]],
      [7, 6, 1, [StepType.ENDPOINT, StepType.LASTPOINT]],

      // side 2
      [1, 1, 2, [StepType.BENCH]],
      [1, 2, 2, [StepType.BENCH]],
      [2, 1, 2, [StepType.BENCH]],
      [2, 2, 2, [StepType.BENCH]],
      [5, 1, 2, [StepType.COMMON, StepType.STARTPOINT, StepType.SAFEZONE]],
      [5, 2, 2, [StepType.COMMON]],
      [5, 3, 2, [StepType.COMMON]],
      [5, 4, 2, [StepType.COMMON]],
      [5, 5, 2, [StepType.COMMON]],
      [4, 5, 2, [StepType.COMMON]],
      [3, 5, 2, [StepType.COMMON]],
      [2, 5, 2, [StepType.COMMON]],
      [1, 5, 2, [StepType.COMMON]],
      [1, 6, 2, [StepType.COMMON]],
      [6, 2, 2, [StepType.ENDPOINT]],
      [6, 3, 2, [StepType.ENDPOINT]],
      [6, 4, 2, [StepType.ENDPOINT]],
      [6, 5, 2, [StepType.ENDPOINT, StepType.LASTPOINT]],

      // side 3
      [1, 10, 3, [StepType.BENCH]],
      [1, 11, 3, [StepType.BENCH]],
      [2, 10, 3, [StepType.BENCH]],
      [2, 11, 3, [StepType.BENCH]],
      [1, 7, 3, [StepType.COMMON, StepType.STARTPOINT, StepType.SAFEZONE]],
      [2, 7, 3, [StepType.COMMON]],
      [3, 7, 3, [StepType.COMMON]],
      [4, 7, 3, [StepType.COMMON]],
      [5, 7, 3, [StepType.COMMON]],
      [5, 8, 3, [StepType.COMMON]],
      [5, 9, 3, [StepType.COMMON]],
      [5, 10, 3, [StepType.COMMON]],
      [5, 11, 3, [StepType.COMMON]],
      [6, 11, 3, [StepType.COMMON]],
      [2, 6, 3, [StepType.ENDPOINT]],
      [3, 6, 3, [StepType.ENDPOINT]],
      [4, 6, 3, [StepType.ENDPOINT]],
      [5, 6, 3, [StepType.ENDPOINT, StepType.LASTPOINT]],

      // side 4
      [10, 10, 4, [StepType.BENCH]],
      [10, 11, 4, [StepType.BENCH]],
      [11, 10, 4, [StepType.BENCH]],
      [11, 11, 4, [StepType.BENCH]],
      [7, 11, 4, [StepType.COMMON, StepType.STARTPOINT, StepType.SAFEZONE]],
      [7, 10, 4, [StepType.COMMON]],
      [7, 9, 4, [StepType.COMMON]],
      [7, 8, 4, [StepType.COMMON]],
      [7, 7, 4, [StepType.COMMON]],
      [8, 7, 4, [StepType.COMMON]],
      [9, 7, 4, [StepType.COMMON]],
      [10, 7, 4, [StepType.COMMON]],
      [11, 7, 4, [StepType.COMMON]],
      [11, 6, 4, [StepType.COMMON]],
      [6, 10, 4, [StepType.ENDPOINT]],
      [6, 9, 4, [StepType.ENDPOINT]],
      [6, 8, 4, [StepType.ENDPOINT]],
      [6, 7, 4, [StepType.ENDPOINT, StepType.LASTPOINT]],

      // final step
      [6, 6, 0, [StepType.FINAL, StepType.SAFEZONE]]
    ]
  },
  getters: {
    getStepByPosition: (state: any) => (position: PositionInBoard) => {
      return state.list.find((step: StepPlace) => step[0] === position.row && step[1] === position.column);
    },
    allBenchs(state: any) {
      return state.list.filter((step: StepPlace) => step[3].includes(StepType.BENCH));
    },
    sideBenchs: (state: any) => ({ side }: Player) => {
      return state.list.filter((step: StepPlace) => step[2] === side && step[3].includes(StepType.BENCH));
    },
    sideCommons: (state: any) => ({ side }: Player) => {
      return state.list.filter((step: StepPlace) => step[2] === side && step[3].includes(StepType.COMMON));
    },
    sideEndpoints: (state: any) => ({ side }: Player) => {
      return state.list.filter((step: StepPlace) => step[2] === side && step[3].includes(StepType.ENDPOINT));
    },
    sideStartpoint: (state: any) => ({ side }: Player) => {
      return state.list.find((step: StepPlace) => step[2] === side && step[3].includes(StepType.STARTPOINT));
    },
    sideSteps: (state: any, getters: any) => ({ side }: Player) => {
      return [...getters.sideCommons({ side }), ...getters.sideEndpoints({ side })];
    },
    finalStep(state: any) {
      return state.list.find((step: StepPlace) => step[3].includes(StepType.FINAL));
    },
    allSteps(state: any, getters: any) {
      return [
        ...getters.allBenchs,
        ...getters.sideSteps({ side: 1 }),
        ...getters.sideSteps({ side: 2 }),
        ...getters.sideSteps({ side: 3 }),
        ...getters.sideSteps({ side: 4 }),
        getters.finalStep
      ];
    },
    allPaths: (state: any, getters: any) => ({ side }: Player) => {
      switch (side) {
        case 1:
          return [
            ...getters.sideCommons({ side: 1 }),
            ...getters.sideCommons({ side: 2 }),
            ...getters.sideCommons({ side: 3 }),
            ...getters.sideCommons({ side: 4 }),
            ...getters.sideEndpoints({ side: 1 }),
            getters.finalStep
          ];
        case 2:
          return [
            ...getters.sideCommons({ side: 2 }),
            ...getters.sideCommons({ side: 3 }),
            ...getters.sideCommons({ side: 4 }),
            ...getters.sideCommons({ side: 1 }),
            ...getters.sideEndpoints({ side: 2 }),
            getters.finalStep
          ];
        case 3:
          return [
            ...getters.sideCommons({ side: 3 }),
            ...getters.sideCommons({ side: 4 }),
            ...getters.sideCommons({ side: 1 }),
            ...getters.sideCommons({ side: 2 }),
            ...getters.sideEndpoints({ side: 3 }),
            getters.finalStep
          ];
        case 4:
          return [
            ...getters.sideCommons({ side: 4 }),
            ...getters.sideCommons({ side: 1 }),
            ...getters.sideCommons({ side: 2 }),
            ...getters.sideCommons({ side: 3 }),
            ...getters.sideEndpoints({ side: 4 }),
            getters.finalStep
          ];
      }
    }
  }
};
