import Vue from "vue";
import { BoardStatus } from "@/types/types.ts";

const initialState = {
  shouldShowMenu: true,
  boardStatus: BoardStatus.INITIALIZING,
  diceInfo: {
    value: null,
    player: null,
    isDone: true
  },
  boardWidth: null
};

export default {
  namespaced: true,
  state: initialState,
  mutations: {
    update(state: any, { key, value }: { key: string; value: any }) {
      Vue.set(state, key, value);
    },
    reset(state: any) {
      state = initialState;
    }
  },
  actions: {
    update({ commit }: any, data: { key: string; value: any }) {
      commit("update", data);
    },
    reset({ commit }: { commit: any }) {
      commit("reset");
    }
  },
  getters: {
    shouldShowMenu: (state: any) => {
      return state.shouldShowMenu;
    },
    diceInfo(state: any) {
      return state.diceInfo;
    },
    boardStatus(state: any) {
      return state.boardStatus;
    },
    boardWidth(state: any) {
      return state.boardWidth;
    }
  }
};
