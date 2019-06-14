import { Player, Marble, PositionInBoard, MoveAction } from "@/types/types";
import { isSameStep, getPositionOfMarble } from "@/helpers";
import { listInitial } from "@/store/initials/marbles-initial.ts";
import Vue from "vue";

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
