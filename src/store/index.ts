import Vue from 'vue'
import Vuex from 'vuex'
import steps from './modules/steps'
import players from './modules/players'
import marbles from './modules/marbles'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    steps,
    players,
    marbles,
  },
})

export default store
