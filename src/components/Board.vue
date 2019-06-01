<template>
  <section class="board m-3 p-3">
    <div class="board-inner">
      <Road class="road"/>
      <Marbles class="marbles"/>
    </div>
    <div class="mt-4">dice: {{diceResult}}</div>
  </section>
</template>

<script lang="ts">
import store from "@/store/index";
import Road from "@/components/Road.vue";
import Marbles from "@/components/Marbles.vue";
import {
  getAvailableActions,
  prepareMoveMarble,
  chooseAction,
  hasMultipleAvailableActions
} from "@/functions/move-actions";
import { Vue, Component } from "vue-property-decorator";
import { Player, MoveAction } from "@/types/types";

const PLAYING_STATUS = {
  LOADING: 1,
  DICING: 2,
  WAITING_FOR_ACTION: 3
};

@Component({
  components: {
    Road,
    Marbles
  },
  props: {}
})
export default class BoardComponent extends Vue {
  data(): {
    players: Player[];
    status: null;
    playerTurn: Player | null;
    diceResult: number | null;
  } {
    return {
      players: [],
      status: null,
      playerTurn: null,
      diceResult: null
    };
  }

  mounted() {
    this.startGame();
  }

  get playersInGame() {
    return store.getters["players/listInGame"];
  }

  startGame() {
    this.resetGame();
    this.addPlayers();
    this.setPlayerTurn();
    this.playTurn();
  }
  resetGame() {
    this.setStatus(PLAYING_STATUS.LOADING);
    store.dispatch("marbles/reset");
    store.dispatch("players/reset");
    this.setStatus(PLAYING_STATUS.WAITING_FOR_ACTION);
  }
  addPlayers() {
    store.dispatch("players/add", { isAI: false, color: "red" });
    store.dispatch("players/add", { isAI: true, color: "green" });
    store.dispatch("players/add", { isAI: true, color: "blue" });
    store.dispatch("players/add", { isAI: true, color: "yellow" });
    store.dispatch("players/updateIsInGameAll", { isInGame: true });
    this.players = store.getters["players/list"];
  }
  setPlayerTurn() {
    if (!this.playerTurn) {
      // TODO: make it random
      this.playerTurn = this.playersInGame[0];
      return;
    }
    const currentPlayerTurnIndex = this.playersInGame.findIndex(
      (player: Player) => player.id === this.playerTurn.id
    );
    const currentIsLast =
      currentPlayerTurnIndex + 1 === this.playersInGame.length;
    this.playerTurn = currentIsLast
      ? this.playersInGame[0]
      : this.playersInGame[currentPlayerTurnIndex + 1];
  }

  playTurn() {
    this.diceResult = this.getDice();
    const availableActions = this.getAvailableActions(this.diceResult);
    if (this.shouldAutoMove(availableActions)) {
      this.autoMove(availableActions);
    } else {
      this.waitForMove(this.diceResult);
    }
  }

  shouldAutoMove(availableActions: MoveAction[]): boolean {
    return (
      this.playerTurn.isAI || !hasMultipleAvailableActions(availableActions)
    );
  }

  autoMove(availableActions: MoveAction[]): void {
    const moveAction = chooseAction(availableActions);
    store.dispatch("marbles/moveToByAction", moveAction);
  }

  waitForMove(diceResult: number): void {
    prepareMoveMarble({
      player: this.playerTurn,
      diceResult
    });
  }

  getAvailableActions(diceResult: number): MoveAction[] {
    return getAvailableActions({
      player: this.playerTurn,
      diceResult
    });
  }

  getDice(): number {
    const result = Math.ceil(Math.random() * 6);
    return result;
  }

  setStatus(status) {
    this.status = status;
  }
}
</script>

<style lang="scss">
.board {
  background: $light;
  box-shadow: 1px 1px 3px $gray-60;
  border-radius: $border-radius-sm;
  width: rem(480px) + $grid-gutter-width * 2;
  height: rem(480px) + $grid-gutter-width * 2;
}
.board-inner {
  position: relative;
  height: 100%;
}
.road {
  width: rem(480px);
  height: rem(480px);
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
</style>