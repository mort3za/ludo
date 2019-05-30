export default {
  namespaced: true,
  state: {
    list: []
  },
  mutations: {
    updateIsInGame(state, { id, isInGame }: Player) {
      const index = state.list.findIndex((item: Player) => item.id === id);
      state.list[index].isInGame = isInGame;
    },
    reset(state) {
      state.list = [];
    },
    add(state, player: Player) {
      state.list.push(player);
    }
  },
  actions: {
    updateIsInGame({ commit }, payload) {
      commit("updateIsInGame", payload);
    },
    updateIsInGameAll({ commit, getters }, { isInGame }: Player) {
      const playersList = getters.list;
      playersList.forEach((p: Player) => {
        const player = { ...p, isInGame };
        commit("updateIsInGame", player);
      });
    },
    reset({ commit }) {
      commit("reset");
    },
    add({ commit, getters }, { isAI, isInGame = true, color }: Player) {
      // get length of list of players
      const playersCount = getters.list.length;
      const player = {
        id: playersCount + 1,
        side: playersCount + 1,
        color,
        name: `Player ${playersCount + 1}`,
        isInGame,
        isAI
      };
      commit("add", player);
    }
  },
  getters: {
    list(state) {
      return state.list;
    },
    itemById: state => (id: number) => {
      return state.list.find((p: Player) => p.id === id);
    },
    itemBySide: state => (side: number) => {
      return state.list.find((p: Player) => p.side === side);
    },
    listInGame(state) {
      return state.list.filter((p: Player) => p.isInGame === true);
    }
  }
};
