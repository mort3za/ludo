import Vue from "vue";
import Vuex from "vuex";
import steps from "./modules/steps";
import players from "./modules/players";
import marbles from "./modules/marbles";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    diceResult: null
  },
  mutations: {
    updateDice(state, diceResult) {
      state.diceResult = diceResult;
    }
  },
  actions: {
    updateDice({ commit }: { commit: any }, diceResult) {
      commit("updateDice", diceResult);
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
    }
  }
});

export default store;
