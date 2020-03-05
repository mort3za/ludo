import Vue from 'vue';
import { BoardStatus, Player } from '@/types/types.ts';
import store from '@/store/index.ts';

const initialState: any = {
  shouldShowMenu: true,
  boardStatus: BoardStatus.INITIALIZING,
  playerActive: null,
  playerWinner: null,
  diceInfo: {
    value: null,
    player: null,
    isDone: null
  }
};

export default {
  namespaced: true,
  state: { ...initialState, boardWidth: null },
  mutations: {
    update(state: any, { key, value }: { key: string; value: any }) {
      Vue.set(state, key, value);
    },
    reset(state: any) {
      for (const key in initialState) {
        if (initialState.hasOwnProperty(key)) {
          Vue.set(state, key, initialState[key]);
        }
      }
    }
  },
  actions: {
    update({ commit }: any, data: { key: string; value: any }) {
      commit('update', data);
    },
    reset({ commit }: { commit: any }) {
      commit('reset');
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
    },
    playerActive(state: any): Player | null {
      if (!state.playerActive) {
        return null;
      }
      return store.getters['players/itemById'](state.playerActive.id);
    },
    playerWinner(state: any): Player | null {
      if (!state.playerWinner) {
        return null;
      }
      return store.getters['players/itemById'](state.playerWinner.id);
    }
  }
};
