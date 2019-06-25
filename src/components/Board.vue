<template>
  <div class="board-w mx-auto my-3">
    <div class="toolbar d-flex">
      <a class="menu-toggle d-block mx-3 mb-3" href="#" @click.prevent="menuToggle()"></a>
    </div>
    <div class="mx-3">
      <div class="aspect-ratio-box mb-3">
        <div class="aspect-ratio-box-inside">
          <section class="board p-3">
            <div ref="boardInner" class="board-inner">
              <Road :active-player="activePlayer" class="road"/>
              <Marbles v-on:clickmarble="onClickMarble" class="marbles"/>
              <Dice
                @turn_dice="turnDice()"
                :board-status="boardStatus"
                :dice-result="diceResult"
                :side="activePlayer.side"
              />
            </div>
          </section>
          <MenuBoard
            v-show="shouldShowMenu"
            @start_game="startGame()"
            @resume_game="resumeGame()"
            @quit_game="quitGame()"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import store from "@/store/index";
import Road from "@/components/Road.vue";
import Dice from "@/components/Dice.vue";
import Marbles from "@/components/Marbles.vue";
import MenuBoard from "@/components/MenuBoard.vue";
import {
  getAvailableActions,
  chooseAction,
  hasMultipleAvailableActions,
  canMove,
  afterMoveActions,
  moveStepByStep,
  beforeMoveActions
} from "@/functions/move-helpers.ts";
import { Vue, Component } from "vue-property-decorator";
import {
  Player,
  MoveAction,
  Marble,
  BoardStatus,
  GameStatus
} from "@/types/types";
import {
  createMoveAction,
  wait,
  boardWidthUpdater
} from "@/functions/general-helpers.ts";
import { analyzeResult, getRandom } from "@/functions/dice-helpers.ts";
import { SLEEP_BETWEEN_TURNS, SLEEP_AFTER_TURN_DICE } from "@/constants.ts";
import { debounce } from "lodash-es";
import router from "@/router.ts";

@Component({
  components: {
    Dice,
    Road,
    Marbles,
    MenuBoard
  }
})
export default class BoardComponent extends Vue {
  boardWidthUpdaterDebounced = debounce(this.boardWidthUpdater, 150);
  shouldShowMenu = true;

  mounted() {
    this.init();
  }
  destroyed() {
    this.removeResizeListener();
    store.dispatch("updateGameStatus", GameStatus.NOT_STARTED);
  }

  init() {
    store.dispatch("updateBoardStatus", BoardStatus.INITIALIZING);
    store.dispatch("updateGameStatus", GameStatus.NOT_STARTED);
    this.boardWidthUpdater();
    this.resizeListener();
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
    return store.getters["marbles/isAllAtFinal"](this.activePlayer);
  }
  get boardStatus(): BoardStatus {
    return store.getters["boardStatus"];
  }
  get gameStatus(): GameStatus {
    return store.getters["gameStatus"];
  }

  async startGame() {
    this.resetGame();
    await this.addPlayers();
    await this.setActivePlayer(this.getRandomPlayer());
    await store.dispatch("updateGameStatus", GameStatus.PLAYING);
    this.shouldShowMenu = false;
    this.playTurn();
  }
  async menuToggle() {
    this.shouldShowMenu = !this.shouldShowMenu;
  }
  async resumeGame() {
    this.shouldShowMenu = false;
    this.$emit("__resume_game");
  }
  async quitGame() {
    this.cleanupBoard();
    router.push({ name: "home" });
  }
  resumePromise() {
    return new Promise((resolve, reject) => {
      if (this.gameStatus === GameStatus.PLAYING) {
        resolve();
      } else if (this.gameStatus === GameStatus.PAUSED) {
        this.$once("__resume_game", () => {
          resolve();
        });
      }
    });
  }
  cleanupBoard() {
    this.shouldShowMenu = false;
    store.dispatch("marbles/remove");
    store.dispatch("players/remove");
  }
  resetGame() {
    store.dispatch("marbles/reset");
    store.dispatch("players/remove");
  }
  async addPlayers() {
    await store.dispatch("players/add", {
      isAI: false,
      name: "You",
      color: "red",
      isActive: false,
      isInGame: true
    });
    await store.dispatch("players/add", {
      isAI: true,
      color: "green",
      isActive: false,
      isInGame: true
    });
    await store.dispatch("players/add", {
      isAI: true,
      color: "blue",
      isActive: false,
      isInGame: true
    });
    await store.dispatch("players/add", {
      isAI: true,
      color: "yellow",
      isActive: false,
      isInGame: true
    });
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

  getRandomPlayer(): Player {
    const random = Math.ceil(getRandom() * this.allPlayers.length);
    return this.allPlayers[random - 1];
  }

  async setActivePlayer(player: Player) {
    await store.dispatch("players/update", { ...player, isActive: true });
  }

  async playTurn() {
    // console.log("-------------------------------------------------- play turn");
    if (this.isGameOver) {
      // show results & finish game
      console.log("Game is over");
      await store.dispatch("updateBoardStatus", BoardStatus.FINISHED);
      await store.dispatch("updateGameStatus", GameStatus.GAME_OVER);
      return;
    }
    await this.resumePromise();
    if (this.shouldChangeTurn()) {
      this.changeTurn();
    }
    await this.turnDicePromise();

    await this.sleepBetweenTurns();
    if (this.activePlayer.isAI) {
      await this.performActionsOfPlayerAI();
    } else {
      this.performActionsOfPlayerNoAI();
    }
  }

  async sleepBetweenTurns() {
    await wait(SLEEP_BETWEEN_TURNS);
  }

  async performActionsOfPlayerAI() {
    const availableActions = this.getAvailableActions();

    if (availableActions.length === 0) {
      // console.log("---- no action ----");
      this.playTurn();
    } else if (this.shouldAutoMove(availableActions)) {
      // console.log("auto move");
      await this.autoMove(availableActions);
      this.playTurn();
    }
  }

  performActionsOfPlayerNoAI(): void {
    const availableActions = this.getAvailableActions();

    // console.log("Human move (wait or skip)");
    if (availableActions.length > 0) {
      store.dispatch("updateBoardStatus", BoardStatus.PLAYER_IS_THINKING);
      this.setMoveableMarbles(availableActions);
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

    beforeMoveActions(moveAction, this.activePlayer);
    const updatedMoveAction = await this.move(moveAction);
    await afterMoveActions(updatedMoveAction, this.activePlayer);
    this.playTurn();
  }

  setMoveableMarbles(availableActions: MoveAction[]): void {
    const marbles: Marble[] = availableActions.map(action => action.marble);
    store.dispatch("marbles/setMoveableItems", marbles);
  }

  shouldAutoMove(availableActions: MoveAction[]): boolean {
    return (
      this.activePlayer.isAI || !hasMultipleAvailableActions(availableActions)
    );
  }

  async autoMove(availableActions: MoveAction[]) {
    const moveAction = chooseAction(availableActions);
    beforeMoveActions(moveAction, this.activePlayer);
    const updatedMoveAction = await this.move(moveAction);
    await afterMoveActions(updatedMoveAction, this.activePlayer);
  }

  async move(moveAction: MoveAction): Promise<MoveAction> {
    const updatedMoveAction = await moveStepByStep(moveAction);
    // console.log("* move done *", moveAction);
    return updatedMoveAction;
  }

  getAvailableActions(): MoveAction[] {
    return getAvailableActions({
      player: this.activePlayer,
      diceResult: this.diceResult
    });
  }

  turnDicePromise() {
    return new Promise((resolve, reject) => {
      if (this.activePlayer.isAI) {
        this.turnDice();
        resolve();
      } else {
        store.dispatch("updateBoardStatus", BoardStatus.WAITING_TURN_DICE);
        this.$once("__turn_dice", () => {
          resolve();
        });
      }
    });
  }

  async turnDice() {
    store.dispatch("updateBoardStatus", BoardStatus.TURNING_DICE);
    const result = Math.ceil(getRandom() * 6);
    store.dispatch("updateDice", result);
    // console.log("dice:", result, "player:", this.activePlayer.id);
    this.$emit("__turn_dice");
    await wait(SLEEP_AFTER_TURN_DICE);
  }

  boardWidthUpdater() {
    // @ts-ignore
    boardWidthUpdater({ boardElement: this.$refs.boardInner });
  }

  resizeListener() {
    window.addEventListener("resize", this.boardWidthUpdaterDebounced);
  }
  removeResizeListener() {
    window.removeEventListener("resize", this.boardWidthUpdaterDebounced);
  }
}
</script>

<style lang="scss">
.board-w {
  max-width: $board-width;
}
.board {
  background: $light;
  box-shadow: 1px 1px 3px $gray-60;
  border-radius: $border-radius-sm;
  max-width: 100%;
  height: 100%;
  // width: rem($board-width) + $grid-gutter-width * 2;
  // height: rem($board-width) + $grid-gutter-width * 2;
}
.board-inner {
  position: relative;
  height: 100%;
}
.road {
  max-width: 100%;
  height: 100%;
  // width: rem($board-width);
  // height: rem($board-width);
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.aspect-ratio-box {
  height: 0;
  padding-top: 100%;
  position: relative;
}
.aspect-ratio-box-inside {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.menu-toggle {
  background: url("../assets/img/menu.svg") no-repeat center;
  background-size: rem(32px);
  width: rem(32px);
  height: rem(32px);
}
</style>