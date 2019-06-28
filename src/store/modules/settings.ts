export default {
  namespaced: true,
  state: {
    gamePlay: {
      isSafezonesEnabled: false
      // TODO: playersCount: 4
    }
  },
  mutations: {},
  actions: {},
  getters: {
    gamePlay(state: any) {
      return state.gamePlay;
    }
  }
};
