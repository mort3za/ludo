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

enum StepType {
  BENCH = 0,
  COMMON = 1,
  ENDPOINT = 2
}

export default {
  namespaced: true,
  state: {
    list: [
      // side 1
      [10, 1, 1, StepType.BENCH],
      [10, 2, 1, StepType.BENCH],
      [11, 1, 1, StepType.BENCH],
      [11, 2, 1, StepType.BENCH],
      [11, 5, 1, StepType.COMMON],
      [10, 5, 1, StepType.COMMON],
      [9, 5, 1, StepType.COMMON],
      [8, 5, 1, StepType.COMMON],
      [7, 5, 1, StepType.COMMON],
      [7, 4, 1, StepType.COMMON],
      [7, 3, 1, StepType.COMMON],
      [7, 2, 1, StepType.COMMON],
      [7, 1, 1, StepType.COMMON],
      [6, 1, 1, StepType.COMMON],
      [10, 6, 1, StepType.ENDPOINT],
      [9, 6, 1, StepType.ENDPOINT],
      [8, 6, 1, StepType.ENDPOINT],
      [7, 6, 1, StepType.ENDPOINT],

      // side 2
      [1, 1, 2, StepType.BENCH],
      [1, 2, 2, StepType.BENCH],
      [2, 1, 2, StepType.BENCH],
      [2, 2, 2, StepType.BENCH],
      [5, 1, 2, StepType.COMMON],
      [5, 2, 2, StepType.COMMON],
      [5, 3, 2, StepType.COMMON],
      [5, 4, 2, StepType.COMMON],
      [5, 5, 2, StepType.COMMON],
      [4, 5, 2, StepType.COMMON],
      [3, 5, 2, StepType.COMMON],
      [2, 5, 2, StepType.COMMON],
      [1, 5, 2, StepType.COMMON],
      [1, 6, 2, StepType.COMMON],
      [6, 2, 2, StepType.ENDPOINT],
      [6, 3, 2, StepType.ENDPOINT],
      [6, 4, 2, StepType.ENDPOINT],
      [6, 5, 2, StepType.ENDPOINT],

      // side 3
      [1, 10, 3, StepType.BENCH],
      [1, 11, 3, StepType.BENCH],
      [2, 10, 3, StepType.BENCH],
      [2, 11, 3, StepType.BENCH],
      [1, 7, 3, StepType.COMMON],
      [2, 7, 3, StepType.COMMON],
      [3, 7, 3, StepType.COMMON],
      [4, 7, 3, StepType.COMMON],
      [5, 7, 3, StepType.COMMON],
      [5, 8, 3, StepType.COMMON],
      [5, 9, 3, StepType.COMMON],
      [5, 10, 3, StepType.COMMON],
      [5, 11, 3, StepType.COMMON],
      [6, 11, 3, StepType.COMMON],
      [2, 6, 3, StepType.ENDPOINT],
      [3, 6, 3, StepType.ENDPOINT],
      [4, 6, 3, StepType.ENDPOINT],
      [5, 6, 3, StepType.ENDPOINT],

      // side 4
      [10, 10, 4, StepType.BENCH],
      [10, 11, 4, StepType.BENCH],
      [11, 10, 4, StepType.BENCH],
      [11, 11, 4, StepType.BENCH],
      [7, 11, 4, StepType.COMMON],
      [7, 10, 4, StepType.COMMON],
      [7, 9, 4, StepType.COMMON],
      [7, 8, 4, StepType.COMMON],
      [7, 7, 4, StepType.COMMON],
      [8, 7, 4, StepType.COMMON],
      [9, 7, 4, StepType.COMMON],
      [10, 7, 4, StepType.COMMON],
      [11, 7, 4, StepType.COMMON],
      [11, 6, 4, StepType.COMMON],
      [6, 10, 4, StepType.ENDPOINT],
      [6, 9, 4, StepType.ENDPOINT],
      [6, 8, 4, StepType.ENDPOINT],
      [6, 7, 4, StepType.ENDPOINT]
    ]
  },
  getters: {
    sideBenchs: state => ({ side }: Player) => {
      return state.list.filter((step: StepPlace) => step[2] === side && step[3] === StepType.BENCH);
    },
    sideCommons: state => ({ side }: Player) => {
      return state.list.filter((step: StepPlace) => step[2] === side && step[3] === StepType.COMMON);
    },
    sideEndpoints: state => ({ side }: Player) => {
      return state.list.filter((step: StepPlace) => step[2] === side && step[3] === StepType.ENDPOINT);
    },
    sideSteps: (state, getters) => ({ side }: Player) => {
      return [...getters.sideCommons({ side }), ...getters.sideEndpoints({ side })];
    },
    allSteps(state, getters) {
      return [
        ...getters.sideSteps({ side: 1 }),
        ...getters.sideSteps({ side: 2 }),
        ...getters.sideSteps({ side: 3 }),
        ...getters.sideSteps({ side: 4 })
      ];
    },
    allPaths: (state, getters) => ({ side }: Player) => {
      switch (side) {
        case 1:
          return [
            ...getters.sideCommons({ side: 1 }),
            ...getters.sideCommons({ side: 2 }),
            ...getters.sideCommons({ side: 3 }),
            ...getters.sideCommons({ side: 4 }),
            ...getters.sideEndpoints({ side: 1 })
          ];
        case 2:
          return [
            ...getters.sideCommons({ side: 2 }),
            ...getters.sideCommons({ side: 3 }),
            ...getters.sideCommons({ side: 4 }),
            ...getters.sideCommons({ side: 1 }),
            ...getters.sideEndpoints({ side: 2 })
          ];
        case 3:
          return [
            ...getters.sideCommons({ side: 3 }),
            ...getters.sideCommons({ side: 4 }),
            ...getters.sideCommons({ side: 1 }),
            ...getters.sideCommons({ side: 2 }),
            ...getters.sideEndpoints({ side: 3 })
          ];
        case 4:
          return [
            ...getters.sideCommons({ side: 4 }),
            ...getters.sideCommons({ side: 1 }),
            ...getters.sideCommons({ side: 2 }),
            ...getters.sideCommons({ side: 3 }),
            ...getters.sideEndpoints({ side: 4 })
          ];
      }
    }
  }
};
