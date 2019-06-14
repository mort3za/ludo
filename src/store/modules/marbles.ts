import { Player, Marble, PositionInBoard, MoveAction } from "@/types/types";
import { isSameStep, getPositionOfMarble } from "@/helpers";
import Vue from "vue";

const listInitial: Marble[] = [
  // side 1
  // {
  //   id: 1,
  //   row: 4,
  //   column: 5,
  //   side: 1,
  //   isInGame: true,
  //   isAtEnd: false,
  //   isAtFinal: false,
  //   isMoveable: false,
  //   isMoving: false
  // },
  // {
  //   id: 2,
  //   row: 5,
  //   column: 5,
  //   side: 1,
  //   isInGame: true,
  //   isAtEnd: false,
  //   isAtFinal: false,
  //   isMoveable: false,
  //   isMoving: false
  // },
  {
    id: 1,
    row: 11,
    column: 1,
    side: 1,
    isInGame: false,
    isAtEnd: false,
    isAtFinal: false,
    isMoveable: false,
    isMoving: false
  },
  {
    id: 2,
    row: 11,
    column: 2,
    side: 1,
    isInGame: false,
    isAtEnd: false,
    isAtFinal: false,
    isMoveable: false,
    isMoving: false
  },
  {
    id: 3,
    row: 10,
    column: 1,
    side: 1,
    isInGame: false,
    isAtEnd: false,
    isAtFinal: false,
    isMoveable: false,
    isMoving: false
  },
  {
    id: 4,
    row: 10,
    column: 2,
    side: 1,
    isInGame: false,
    isAtEnd: false,
    isAtFinal: false,
    isMoveable: false,
    isMoving: false
  },
  // side 2
  // {
  //   id: 5,
  //   row: 2,
  //   column: 5,
  //   side: 2,
  //   isInGame: true,
  //   isAtEnd: false,
  //   isAtFinal: false,
  //   isMoveable: false,
  //   isMoving: false
  // },
  // {
  //   id: 6,
  //   row: 1,
  //   column: 5,
  //   side: 2,
  //   isInGame: true,
  //   isAtEnd: false,
  //   isAtFinal: false,
  //   isMoveable: false,
  //   isMoving: false
  // },
  {
    id: 5,
    row: 1,
    column: 1,
    side: 2,
    isInGame: false,
    isAtEnd: false,
    isAtFinal: false,
    isMoveable: false,
    isMoving: false
  },
  {
    id: 6,
    row: 1,
    column: 2,
    side: 2,
    isInGame: false,
    isAtEnd: false,
    isAtFinal: false,
    isMoveable: false,
    isMoving: false
  },
  {
    id: 7,
    row: 2,
    column: 1,
    side: 2,
    isInGame: false,
    isAtEnd: false,
    isAtFinal: false,
    isMoveable: false,
    isMoving: false
  },
  {
    id: 8,
    row: 2,
    column: 2,
    side: 2,
    isInGame: false,
    isAtEnd: false,
    isAtFinal: false,
    isMoveable: false,
    isMoving: false
  },
  // side 3
  {
    id: 9,
    row: 1,
    column: 10,
    side: 3,
    isInGame: false,
    isAtEnd: false,
    isAtFinal: false,
    isMoveable: false,
    isMoving: false
  },
  {
    id: 10,
    row: 1,
    column: 11,
    side: 3,
    isInGame: false,
    isAtEnd: false,
    isAtFinal: false,
    isMoveable: false,
    isMoving: false
  },
  {
    id: 11,
    row: 2,
    column: 10,
    side: 3,
    isInGame: false,
    isAtEnd: false,
    isAtFinal: false,
    isMoveable: false,
    isMoving: false
  },
  {
    id: 12,
    row: 2,
    column: 11,
    side: 3,
    isInGame: false,
    isAtEnd: false,
    isAtFinal: false,
    isMoveable: false,
    isMoving: false
  },
  // side 4
  {
    id: 13,
    row: 10,
    column: 10,
    side: 4,
    isInGame: false,
    isAtEnd: false,
    isAtFinal: false,
    isMoveable: false,
    isMoving: false
  },
  {
    id: 14,
    row: 10,
    column: 11,
    side: 4,
    isInGame: false,
    isAtEnd: false,
    isAtFinal: false,
    isMoveable: false,
    isMoving: false
  },
  {
    id: 15,
    row: 11,
    column: 10,
    side: 4,
    isInGame: false,
    isAtEnd: false,
    isAtFinal: false,
    isMoveable: false,
    isMoving: false
  },
  {
    id: 16,
    row: 11,
    column: 11,
    side: 4,
    isInGame: false,
    isAtEnd: false,
    isAtFinal: false,
    isMoveable: false,
    isMoving: false
  }
];

export default {
  namespaced: true,
  state: {
    list: [],
    listInitial
  },
  mutations: {
    update(state: any, marble: Marble) {
      const index = state.list.findIndex((m: Marble) => m.id === marble.id);
      Vue.set(state.list, index, marble);
    },
    reset(state: any) {
      state.list = [...listInitial];
    },
    setItemMoveable(state: any, marble: Marble) {
      const targetMarble = state.list.find((m: Marble) => m.id === marble.id);
      targetMarble.isMoveable = true;
    }
  },
  actions: {
    update({ commit }: { commit: any }, marble: Marble) {
      commit("update", marble);
    },
    reset({ commit }: { commit: any }) {
      commit("reset");
    },
    setMoveableItems({ commit }: { commit: any }, marbles: Marble[] = []) {
      marbles.forEach((m: Marble) => commit("update", { ...m, isMoveable: true }));
    },
    unsetMoveableAll({ commit, getters }: { commit: any; getters: any }) {
      getters.list.forEach((m: Marble) => commit("update", { ...m, isMoveable: false }));
    }
  },
  getters: {
    list(state: any): Marble[] {
      return state.list;
    },
    listByPlayer: (state: any, getters: any) => (player: Player) => {
      return getters.list.filter((m: Marble) => m.side === player.side);
    },
    listInGame(state: any, getters: any) {
      return getters.list.filter((m: Marble) => m.isInGame === true);
    },
    listInBench(state: any, getters: any) {
      return getters.list.filter((m: Marble) => m.isInGame === false);
    },
    listInGameByPlayer: (state: any, getters: any) => (player: Player) => {
      return getters.list.filter((m: Marble) => m.side === player.side && m.isInGame === true);
    },
    listInBenchByPlayer: (state: any, getters: any) => (player: Player) => {
      return getters.list.filter((m: Marble) => m.side === player.side && m.isInGame === false);
    },
    listOtherPlayersMarblesByPosition: (state: any, getters: any) => (
      player: Player,
      position: PositionInBoard
    ) => {
      return getters.list.filter(
        (m: Marble) => m.side !== player.side && isSameStep(getPositionOfMarble(m), position)
      );
    },
    listInitial(state: any): Marble[] {
      return state.listInitial;
    },
    isGameFinishedForPlayer: (state: any, getters: any) => (player: Player) => {
      const playerMarbles = getters.listByPlayer(player);
      return playerMarbles.every((m: Marble) => m.isAtFinal);
    }
  }
};
