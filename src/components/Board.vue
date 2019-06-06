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
  canMove,
  performAfterMoveActions
} from "@/functions/move-actions";
import { Vue, Component } from "vue-property-decorator";
import { Player, MoveAction, Marble } from "@/types/types";
import { createMoveAction, wait } from "../helpers";
import { analyzeResult } from "../functions/dice";

const WAITING_TIME_BETWEEN_EVERY_TURN = 1000;

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

  get playersInGame(): Player[] {
    return store.getters["players/listInGame"];
  }
  get allPlayers(): Player[] {
    return store.getters["players/list"];
  }
  get activePlayer(): Player {
    return store.getters["players/active"] || {};
  }
  get diceResult(): number {
    return store.getters["diceResult"];
  }
  get diceAnalization() {
    return analyzeResult(this.diceResult);
  }
  get isGameOver(): boolean {
    return store.getters["isGameOver"];
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

  setActivePlayer(player: Player): void {
    store.dispatch("players/updatePlayer", { ...player, isActive: true });
  }

  async playTurn() {
    console.log("-------------------------------------------------- play turn");
    this.unsetMovableMarbles();
    if (this.isGameOver) {
      // show results & finish game
      return;
    }
    if (this.shouldChangeTurn()) {
      this.changeTurn();
    }
    this.turnDice();

    await this.sleepBetweenTurns();
    if (this.activePlayer.isAI) {
      await this.performActionsOfPlayerAI();
    } else {
      this.performActionsOfPlayerNoAI();
    }
  }

  async sleepBetweenTurns() {
    await wait(WAITING_TIME_BETWEEN_EVERY_TURN);
  }

  async performActionsOfPlayerAI() {
    const availableActions = this.getAvailableActions();

    if (availableActions.length === 0) {
      console.log("---- no action ----");
      this.playTurn();
    } else if (this.shouldAutoMove(availableActions)) {
      console.log("auto move");
      await this.autoMove(availableActions);
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

  async onClickMarble(marble: Marble) {
    if (!canMove(marble, this.activePlayer)) return;
    const moveAction = createMoveAction({
      player: this.activePlayer,
      marble,
      diceResult: this.diceResult
    });
    const updatedMoveAction = await this.move(moveAction);
    await performAfterMoveActions(updatedMoveAction, this.activePlayer);
    this.playTurn();
  }

  setMovableMarbles(availableActions: MoveAction[]): void {
    const marbles: Marble[] = availableActions.map(action => action.marble);
    store.dispatch("marbles/setMoveableItems", marbles);
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

  async autoMove(availableActions: MoveAction[]) {
    const moveAction = chooseAction(availableActions);
    const updatedMoveAction = await this.move(moveAction);
    await performAfterMoveActions(updatedMoveAction, this.activePlayer);
  }

  async move(moveAction: MoveAction): Promise<MoveAction> {
    const updatedMarble = {
      ...moveAction.marble,
      isInGame: true,
      row: moveAction.to.row,
      column: moveAction.to.column
    };
    await store.dispatch("marbles/update", updatedMarble);
    const updatedMoveAction = {
      ...moveAction,
      marble: updatedMarble
    };
    console.log("* move done *", moveAction);
    return updatedMoveAction;
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
    console.log("dice:", result, "player:", this.activePlayer.id);
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