import Vue from "vue";
import Vuex from "vuex";
import steps from "@/store/modules/steps.ts";
import players from "@/store/modules/players.ts";
import marbles from "@/store/modules/marbles.ts";
import settings from "@/store/modules/settings.ts";
import { GameStatus, BoardStatus } from "@/types/types.ts";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    diceResult: null,
    gameStatus: GameStatus.NOT_STARTED,
    boardStatus: BoardStatus.INITIALIZING,
    boardWidth: null
  },
  mutations: {
    updateDice(state, diceResult) {
      state.diceResult = diceResult;
    },
    updateGameStatus(state, status: GameStatus) {
      state.gameStatus = status;
    },
    updateBoardStatus(state, status: BoardStatus) {
      state.boardStatus = status;
    },
    updateBoardWidth(state, boardWidth) {
      state.boardWidth = boardWidth;
    }
  },
  actions: {
    updateDice({ commit }: { commit: any }, diceResult) {
      commit("updateDice", diceResult);
    },
    updateGameStatus({ commit }: { commit: any }, status: GameStatus) {
      commit("updateGameStatus", status);
    },
    updateBoardStatus({ commit }: { commit: any }, status: BoardStatus) {
      commit("updateBoardStatus", status);
    },
    updateBoardWidth({ commit }: { commit: any }, width: number) {
      commit("updateBoardWidth", width);
    }
  },
  getters: {
    diceResult(state) {
      return state.diceResult;
    },
    boardStatus(state) {
      return state.boardStatus;
    },
    gameStatus(state) {
      return state.gameStatus;
    },
    boardWidth(state) {
      return state.boardWidth;
    }
  },
  modules: {
    steps,
    players,
    marbles,
    settings
  }
});

export default store;
