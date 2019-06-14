import Vue from "vue";
import Vuex from "vuex";
import steps from "./modules/steps";
import players from "./modules/players";
import marbles from "./modules/marbles";
import { GameStatus, BoardStatus } from "@/types/types";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    diceResult: null,
    gameStatus: GameStatus.NOT_STARTED,
    boardStatus: BoardStatus.INITIALIZING
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
    }
  },
  modules: {
    steps,
    players,
    marbles
  },
  getters: {
    diceResult(state) {
      return state.diceResult;
    },
    boardStatus(state) {
      return state.boardStatus;
    }
  }
});

export default store;
