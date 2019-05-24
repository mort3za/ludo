import Vue from "vue";
import Vuex from "vuex";
import steps from "./modules/steps.js";
import players from "./modules/players.js";
import marbles from "./modules/marbles.js";

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    steps,
    players,
    marbles
  }
});

export default store;
