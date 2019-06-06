<template>
  <div class="container">
    <div class="row">
      <div class="col-6">
        <section class="board m-3 p-3">
          <div class="board-inner">
            <Road class="road"/>
            <Marbles v-on:clickmarble="onClickMarble" class="marbles"/>
          </div>
        </section>
      </div>
      <div class="col-6">
        <div class="mt-4">player: {{activePlayer.id}}</div>
        <div
          class="mt-4"
          :style="{'background': diceResult === 6 ? 'green':'white'}"
        >dice result: {{diceResult}}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import store from "@/store/index";
import Road from "@/components/Road.vue";
import Marbles from "@/components/Marbles.vue";
import {
  getAvailableActions,
  chooseAction,
  hasMultipleAvailableActions,
  canMove
} from "@/functions/move-actions";
import { Vue, Component } from "vue-property-decorator";
import { Player, MoveAction, Marble } from "@/types/types";
import { createMoveAction, wait } from "../helpers";
import { analyzeResult } from "../functions/dice";

const WAITING_TIME_BETWEEN_EVERY_TURN = 1000;

// const PLAYING_STATUS = {
//   LOADING: 1,
//   DICING: 2,
//   WAITING_FOR_ACTION: 3
// };

@Component({
  components: {
    Road,
    Marbles
  },
  props: {}
})
export default class BoardComponent extends Vue {
  mounted() {
    this.startGame();
  }

  get playersInGame() {
    return store.getters["players/listInGame"];
  }
  get allPlayers() {
    return store.getters["players/list"];
  }
  get activePlayer() {
    return store.getters["players/active"] || {};
  }
  get diceResult() {
    return store.getters["diceResult"];
  }
  get diceAnalization() {
    return analyzeResult(this.diceResult);
  }

  startGame(): void {
    this.resetGame();
    this.addPlayers();
    this.playTurn();
  }
  resetGame() {
    store.dispatch("marbles/reset");
    store.dispatch("players/reset");
  }
  addPlayers(): void {
    store.dispatch("players/add", {
      isAI: false,
      color: "red",
      isActive: true
    });
    store.dispatch("players/add", {
      isAI: true,
      color: "green",
      isActive: false
    });
    store.dispatch("players/add", {
      isAI: true,
      color: "blue",
      isActive: false
    });
    store.dispatch("players/add", {
      isAI: true,
      color: "yellow",
      isActive: false
    });
    store.dispatch("players/updateAll", { isInGame: true });
  }
  changeTurn(): void {
    const currentActivePlayerIndex = this.allPlayers.findIndex(
      (p: Player) => p.id === this.activePlayer.id
    );
    const currentActivePlayer = this.allPlayers[currentActivePlayerIndex];
    const newActivePlayerIndex =
      (currentActivePlayerIndex + 1) % this.allPlayers.length;
    const newActivePlayer = this.allPlayers[newActivePlayerIndex];

    store.dispatch("players/update", {
      ...currentActivePlayer,
      isActive: false
    });
    store.dispatch("players/update", { ...newActivePlayer, isActive: true });
  }

  shouldChangeTurn(): boolean {
    if (this.diceAnalization.hasReward) {
      return false;
    }
    return true;
  }

  shouldFinishGame(): boolean {
    // TODO:
    return false;
  }

  setActivePlayer(player: Player): void {
    store.dispatch("players/updatePlayer", { ...player, isActive: true });
  }

  async playTurn(): Promise<void> {
    console.log("-------------------------------------------------- play turn");
    this.unsetMovableMarbles();
    if (this.shouldFinishGame()) {
      // show results & finish game
      return;
    }
    if (this.shouldChangeTurn()) {
      this.changeTurn();
    }
    this.turnDice();

    await this.sleepBetweenTurns();
    if (this.activePlayer.isAI) {
      this.performActionsOfPlayerAI();
    } else {
      this.performActionsOfPlayerNoAI();
    }
  }

  async sleepBetweenTurns(): Promise<void> {
    await wait(WAITING_TIME_BETWEEN_EVERY_TURN);
  }

  performActionsOfPlayerAI(): void {
    const availableActions = this.getAvailableActions();

    if (availableActions.length === 0) {
      console.log("---- no action ----");
      this.playTurn();
    } else if (this.shouldAutoMove(availableActions)) {
      console.log("auto move");
      this.autoMove(availableActions);
      this.playTurn();
    }
  }

  performActionsOfPlayerNoAI(): void {
    const availableActions = this.getAvailableActions();

    console.log("Human move (wait or skip)");
    if (availableActions.length > 0) {
      this.setMovableMarbles(availableActions);
    } else {
      this.playTurn();
    }
  }

  onClickMarble(marble: Marble): void {
    if (!canMove(marble, this.activePlayer)) return;
    const moveAction = createMoveAction({
      player: this.activePlayer,
      marble,
      diceResult: this.diceResult
    });
    this.move(moveAction).then(async () => {
      this.playTurn();
    });
  }

  setMovableMarbles(availableActions: MoveAction[]): void {
    const marbles: Marble[] = availableActions.map(action => action.marble);
    store.dispatch("marbles/setItemsMoveable", marbles);
  }
  unsetMovableMarbles(): void {
    if (this.activePlayer.isAI) return;
    store.dispatch("marbles/unsetMovableAll");
  }

  shouldAutoMove(availableActions: MoveAction[]): boolean {
    return (
      this.activePlayer.isAI || !hasMultipleAvailableActions(availableActions)
    );
  }

  autoMove(availableActions: MoveAction[]): void {
    const moveAction = chooseAction(availableActions);
    this.move(moveAction);
  }

  async move(moveAction: MoveAction): Promise<void> {
    return new Promise((resolve, reject) => {
      store.dispatch("marbles/moveToByAction", moveAction);
      store.dispatch("marbles/update", {
        ...moveAction.marble,
        isInGame: true
      });
      // TODO: set isAtEnd, check isGameOver, kick out other marbles
      resolve();
    });
  }

  getAvailableActions(): MoveAction[] {
    return getAvailableActions({
      player: this.activePlayer,
      diceResult: this.diceResult
    });
  }

  turnDice(): void {
    const result = Math.ceil(Math.random() * 6);
    store.dispatch("updateDice", result);
    console.log("dice:", result);
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