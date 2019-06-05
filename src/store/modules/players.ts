import { Player } from "@/types/types";
import Vue from "vue";

export default {
  namespaced: true,
  state: {
    list: []
  },
  mutations: {
    update(state: any, player: Player) {
      const index = state.list.findIndex((p: Player) => p.id === player.id);
      Vue.set(state.list, index, player);
    },
    reset(state: any) {
      state.list = [];
    },
    add(state: any, player: Player) {
      state.list.push(player);
    }
  },
  actions: {
    update({ commit }: { commit: any }, player: Player) {
      commit("update", player);
    },
    updateAll({ commit, getters }: { commit: any; getters: any }, player: Player) {
      const playersList = getters.list;
      playersList.forEach((p: Player) => {
        const updated = { ...p, ...player };
        commit("update", updated);
      });
    },
    reset({ commit }: { commit: any }) {
      commit("reset");
    },
    add({ commit, getters }: { commit: any; getters: any }, player: Player) {
      // get length of list of players
      const playersCount = getters.list.length;
      const newPlayer = {
        id: playersCount + 1,
        side: playersCount + 1,
        name: `Player ${playersCount + 1}`,
        ...player
      };
      commit("add", newPlayer);
    }
  },
  getters: {
    list(state: any) {
      return state.list;
    },
    itemById: (state: any) => (id: number) => {
      return state.list.find((p: Player) => p.id === id);
    },
    itemBySide: (state: any) => (side: number) => {
      return state.list.find((p: Player) => p.side === side);
    },
    listInGame(state: any) {
      return state.list.filter((p: Player) => p.isInGame);
    },
    active(state: any) {
      return state.list.find((p: Player) => p.isActive);
    }
  }
};
