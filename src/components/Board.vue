<template>
  <section class="board m-3 p-3">
    <div class="board-inner">
      <Road class="road"/>
      <Marbles class="marbles"/>
    </div>
  </section>
</template>

<script>
import store from "@/store/index.ts";
import Road from "@/components/Road.vue";
import Marbles from "@/components/Marbles.vue";
import { getAvailableActions, prepareMoveMarble } from "@/helpers.ts";

const PLAYING_STATUS = {
  LOADING: 1,
  DICING: 2,
  WAITING_FOR_ACTION: 3
};

export default {
  name: "board",
  data() {
    return {
      players: [],
      status: null,
      playerTurn: null
    };
  },
  components: {
    Road,
    Marbles
  },
  mounted() {
    this.startGame();
  },
  computed: {
    playersInGame() {
      return store.getters["players/listInGame"];
    }
  },
  methods: {
    startGame() {
      this.resetGame();
      this.addPlayers();
      this.setPlayerTurn();
      this.playTurn();
    },
    resetGame() {
      this.setStatus(PLAYING_STATUS.LOADING);
      store.dispatch("marbles/reset");
      store.dispatch("players/reset");
      this.setStatus(PLAYING_STATUS.WAITING_FOR_ACTION);
    },
    addPlayers() {
      // FIXME: isInGame: true => temporary
      store.dispatch("players/add", { isAI: false, color: "red" });
      store.dispatch("players/add", { isAI: true, color: "green" });
      store.dispatch("players/add", { isAI: true, color: "blue" });
      store.dispatch("players/add", { isAI: true, color: "yellow" });
      store.dispatch("players/updateIsInGameAll", { isInGame: true });
      this.players = store.getters["players/list"];
    },
    setPlayerTurn() {
      if (!this.playerTurn) {
        this.playerTurn = this.playersInGame[0];
        return;
      }
      const currentPlayerTurnIndex = this.playersInGame.findIndex(
        item => item.id === this.playerTurn.id
      );
      const currentIsLast =
        currentPlayerTurnIndex + 1 === this.playersInGame.length;
      this.playerTurn = currentIsLast
        ? this.playersInGame[0]
        : this.playersInGame[currentPlayerTurnIndex + 1];
    },

    playTurn() {
      const diceResult = this.getDice(this.playerTurn);
      const availableActions = getAvailableActions({
        player: this.playerTurn,
        diceResult: this.diceResult
      });
      console.log("availableActions", availableActions);
      prepareMoveMarble({
        player: this.playerTurn,
        diceResult: this.diceResult
      });
      // setTimeout(() => {
      //   store.dispatch("marbles/moveTo", { id: 1, row: 5, column: 10 });
      // }, 1000);
    },
    getDice() {
      return Math.ceil(Math.random() * 6);
    },
    setStatus(status) {
      this.status = status;
    }
  }
};
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