import Vue from "vue";
import Vuex from "vuex";
import steps from "./modules/steps.ts";
import players from "./modules/players.ts";
import marbles from "./modules/marbles.ts";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    steps,
    players,
    marbles,
  }
});

export default store;
