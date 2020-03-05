import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersistence from 'vuex-persist';
import steps from '@/store/modules/steps.ts';
import players from '@/store/modules/players.ts';
import marbles from '@/store/modules/marbles.ts';
import settings from '@/store/modules/settings.ts';
import board from '@/store/modules/board.ts';
import { GameStatus } from '@/types/types.ts';
import { STORAGE_KEY } from '@/constants';

Vue.use(Vuex);
const persistMutations: string[] = ['saveGame'];

const vuexLocal = new VuexPersistence({
  storage: window.sessionStorage,
  key: STORAGE_KEY,
  filter: mutation => persistMutations.indexOf(mutation.type) >= 0
});

const store = new Vuex.Store({
  plugins: [vuexLocal.plugin],
  state: {
    appVersion: JSON.parse(unescape(process.env.APP_VERSION || 0)),
    buildDate: JSON.parse(unescape(process.env.BUILD_DATE || 0)),
    gameStatus: GameStatus.NOT_STARTED,
    lastSavedAt: null
  },
  mutations: {
    update(state: any, { key, value }: { key: string; value: any }) {
      Vue.set(state, key, value);
    },
    updateGameStatus(state: any, status: GameStatus) {
      state.gameStatus = status;
    },
    // NOTE: will save store data when calling this commit
    saveGame(state: any) {
      const now = new Date().getTime();
      state.lastSavedAt = now;
    }
  },
  actions: {
    updateGameStatus({ commit }: { commit: any }, status: GameStatus) {
      commit('updateGameStatus', status);
    },
    saveGame({ commit }: any) {
      commit('saveGame');
    }
  },
  getters: {
    gameStatus(state) {
      return state.gameStatus;
    },
    appVersion(state) {
      return state.appVersion;
    },
    buildDate(state) {
      return state.buildDate;
    }
  },
  modules: {
    steps,
    players,
    marbles,
    settings,
    board
  }
});

export default store;
