import { Player, Marble, PositionInBoard } from "@/types/types";

const initialList: Marble[] = [
  // side 1
  // FIXME: is in game to false
  { id: 1, row: 5, column: 5, side: 1, isInGame: true, isAtEnd: false },
  { id: 2, row: 2, column: 5, side: 1, isInGame: true, isAtEnd: false },
  // { id: 1, row: 11, column: 1, side: 1, isInGame: false, isAtEnd: false },
  // { id: 2, row: 11, column: 2, side: 1, isInGame: false, isAtEnd: false },
  { id: 3, row: 10, column: 1, side: 1, isInGame: false, isAtEnd: false },
  { id: 4, row: 10, column: 2, side: 1, isInGame: false, isAtEnd: false },
  // side 2
  { id: 5, row: 1, column: 1, side: 2, isInGame: false, isAtEnd: false },
  { id: 6, row: 1, column: 2, side: 2, isInGame: false, isAtEnd: false },
  { id: 7, row: 2, column: 1, side: 2, isInGame: false, isAtEnd: false },
  { id: 8, row: 2, column: 2, side: 2, isInGame: false, isAtEnd: false },
  // side 3
  { id: 9, row: 1, column: 10, side: 3, isInGame: false, isAtEnd: false },
  { id: 10, row: 1, column: 11, side: 3, isInGame: false, isAtEnd: false },
  { id: 11, row: 2, column: 10, side: 3, isInGame: false, isAtEnd: false },
  { id: 12, row: 2, column: 11, side: 3, isInGame: false, isAtEnd: false },
  // side 4
  { id: 13, row: 10, column: 10, side: 4, isInGame: false, isAtEnd: false },
  { id: 14, row: 10, column: 11, side: 4, isInGame: false, isAtEnd: false },
  { id: 15, row: 11, column: 10, side: 4, isInGame: false, isAtEnd: false },
  { id: 16, row: 11, column: 11, side: 4, isInGame: false, isAtEnd: false }
];

export default {
  namespaced: true,
  state: {
    list: [],
    initialList
  },
  mutations: {
    updateIsInGame(state, { id, isInGame }: Marble) {
      const index = state.list.findIndex((m: Marble) => m.id === id);
      state.list[index].isInGame = isInGame;
    },
    moveTo(state, { marble, destination }: { marble: Marble; destination: PositionInBoard }) {
      const index = state.list.findIndex((m: Marble) => m.id === marble.id);
      state.list[index].row = destination.row;
      state.list[index].column = destination.column;
    },
    reset(state) {      
      state.list = [...initialList];
    }
  },
  actions: {
    updateIsInGame({ commit }, payload) {
      commit("updateIsInGame", payload);
    },
    moveTo({ commit }, payload) {
      commit("moveTo", payload);
    },
    reset({ commit }) {
      commit("reset");
    }
  },
  getters: {
    list(state) {
      return state.list;
    },
    listByPlayer: (state, getters) => (player: Player) => {
      return getters.list.filter((m: Marble) => m.side === player.side);
    },
    listInGame(state, getters) {
      return getters.list.filter((m: Marble) => m.isInGame === true);
    },
    listInBench(state, getters) {
      return getters.list.filter((m: Marble) => m.isInGame === false);
    },
    listInGameByPlayer: (state, getters) => (player: Player) => {
      return getters.list.filter((m: Marble) => m.side === player.side && m.isInGame === true);
    },
    listInBenchByPlayer: (state, getters) => (player: Player) => {
      return getters.list.filter((m: Marble) => m.side === player.side && m.isInGame === false);
    }
  }
};
