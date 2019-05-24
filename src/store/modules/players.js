export default {
  namespaced: true,
  state: {
    list: []
  },
  mutations: {
    updateIsInGame(state, { id, isInGame }) {
      const index = state.list.findIndex(_item => _item.id === id);
      state.list[index].isInGame = isInGame;
    },
    reset(state) {
      state.list = [];
    },
    add(state, player) {
      state.list.push(player);
    }
  },
  actions: {
    updateIsInGame({ commit }, payload) {
      commit("updateIsInGame", payload);
    },
    updateIsInGameAll({ commit, getters }, { isInGame }) {
      const playersList = getters.list;
      playersList.forEach(_player => {
        const player = { ..._player, isInGame };
        commit("updateIsInGame", player);
      });
    },
    reset({ commit }) {
      commit("reset");
    },
    add({ commit, getters }, { isAI, isInGame = true, color }) {
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
    itemById: state => id => {
      return state.list.find(item => item.id === id);
    },
    itemBySide: state => side => {
      return state.list.find(item => item.side === side);
    },
    listInGame(state) {
      return state.list.filter(item => item.isInGame === true);
    }
  }
};
