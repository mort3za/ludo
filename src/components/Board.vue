<template>
  <div class="board-w mx-auto py-3">
    <div class="toolbar d-flex">
      <a
        class="menu position-relative d-block mx-3 mb-3"
        href="#"
        @click.prevent="menuToggle()"
        aria-label="Main menu"
      >
        <transition name="fade">
          <span v-if="!shouldShowMenu" class="menu-icon menu-open position-absolute d-block"></span>
        </transition>
        <transition name="fade">
          <span v-if="shouldShowMenu" class="menu-icon menu-close position-absolute d-block"></span>
        </transition>
      </a>
    </div>
    <main class="mx-3">
      <div class="aspect-ratio-box mb-3">
        <div class="aspect-ratio-box-inside">
          <section class="board shadow-sm p-3">
            <div ref="boardInner" class="board-inner">
              <Road class="road" />
              <Marbles v-on:clickmarble="onClickMarble" class="marbles" />
              <Dice @turn_dice="turnDice()" :board-status="boardStatus" :dice-info="diceInfo" />
            </div>
          </section>
          <MenuBoard
            v-show="shouldShowMenu"
            @start_game="startGame()"
            @resume_game="resumeGame()"
            @quit_game="quitGame()"
            :winner-player="winnerPlayer"
          />
        </div>
      </div>
    </main>
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
  beforeMoveActions,
  afterFinishTurn
} from "@/functions/move-helpers.ts";
import { Vue, Component } from "vue-property-decorator";
import {
  Player,
  MoveAction,
  Marble,
  BoardStatus,
  GameStatus,
  DiceInfo
} from "@/types/types";
import {
  createMoveAction,
  wait,
  boardWidthUpdater
} from "@/functions/general-helpers.ts";
import { createDiceInfo, getRandom } from "@/functions/dice-helpers.ts";
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
  winnerPlayer: Player | null = null;

  mounted() {
    this.init();
    this.continueGame();
  }
  destroyed() {
    this.removeResizeListener();
    store.dispatch("updateGameStatus", GameStatus.NOT_STARTED);
  }

  init() {
    this.boardWidthUpdater();
    this.resizeListener();
  }

  continueGame() {
    if (this.gameStatus === GameStatus.PLAYING) {
      console.log("continue game");
      this.playTurn();
    }
  }

  get shouldShowMenu(): boolean {
    return store.getters["board/shouldShowMenu"];
  }
  get playersInGame(): Player[] {
    return store.getters["players/listInGame"];
  }
  get allPlayers(): Player[] {
    return store.getters["players/list"];
  }
  get activePlayer(): Player {
    return store.getters["players/active"];
  }
  get diceInfo(): DiceInfo {
    return store.getters["board/diceInfo"];
  }
  get isGameOver(): boolean {
    return store.getters["marbles/isAllAtFinal"](this.activePlayer);
  }
  get boardStatus(): BoardStatus {
    return store.getters["board/boardStatus"];
  }
  get gameStatus(): GameStatus {
    return store.getters["gameStatus"];
  }

  setShowMenu(shouldShowMenu: boolean): void {
    store.dispatch("board/update", {
      key: "shouldShowMenu",
      value: shouldShowMenu
    });
  }

  async startGame() {
    await this.resetGame();
    await this.addPlayers();
    await this.setActivePlayer(this.getRandomPlayer());
    await store.dispatch("updateGameStatus", GameStatus.PLAYING);
    this.setShowMenu(false);
    this.playTurn();
  }
  finishGame() {
    store.dispatch("board/update", {
      key: "boardStatus",
      value: BoardStatus.FINISHED
    });
    store.dispatch("updateGameStatus", GameStatus.GAME_OVER);
    this.winnerPlayer = this.activePlayer;
    this.setShowMenu(true);
    this.saveGame("game finished");
  }
  async menuToggle() {
    this.setShowMenu(!this.shouldShowMenu);
  }
  async resumeGame() {
    this.setShowMenu(false);
    this.$emit("__resume_game");
  }
  saveGame(reason: string) {
    store.dispatch("saveGame");
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
  async cleanupBoard() {
    await store.dispatch("marbles/remove");
    await store.dispatch("players/remove");
    await store.dispatch("board/reset");
  }
  async resetGame() {
    this.winnerPlayer = null;
    await store.dispatch("marbles/reset");
    await store.dispatch("players/remove");
    await store.dispatch("board/reset");
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
    if (!this.isPreviousMoveCompleted()) {
      return false;
    }
    if (this.isPreviousMoveCompleted() && this.diceInfo.hasReward) {
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
      this.finishGame();
      return;
    }
    await this.resumePromise();
    if (this.shouldChangeTurn()) {
      this.changeTurn();
    }
    await this.turnDicePromise();

    // TODO: remove if is unnecessary
    await this.sleepBetweenTurns();

    let performActionsOfPlayer = this.activePlayer.isAI
      ? this.performActionsOfPlayerAI
      : this.performActionsOfPlayerNoAI;
    await performActionsOfPlayer();
  }

  async sleepBetweenTurns() {
    await wait(SLEEP_BETWEEN_TURNS);
  }

  async performActionsOfPlayerAI() {
    const availableActions = this.getAvailableActions();

    if (availableActions.length === 0) {
      // console.log("---- no action ----");
      await afterFinishTurn();
      this.playTurn();
    } else if (this.shouldAutoMove(availableActions)) {
      // console.log("auto move");
      await this.autoMove(availableActions, this.activePlayer);
      await afterFinishTurn();
      this.playTurn();
    }
  }

  async performActionsOfPlayerNoAI() {
    const availableActions = this.getAvailableActions();

    // console.log("Human move (wait or skip)");
    if (availableActions.length > 0) {
      store.dispatch("board/update", {
        key: "boardStatus",
        value: BoardStatus.PLAYER_IS_THINKING
      });
      this.setMoveableMarbles(availableActions);
    } else {
      await afterFinishTurn();
      this.playTurn();
    }
  }

  async onClickMarble(marble: Marble) {
    if (!canMove(marble, this.activePlayer)) return;
    const moveAction = createMoveAction({
      player: this.activePlayer,
      marble,
      diceInfo: this.diceInfo
    });

    beforeMoveActions(moveAction, this.activePlayer);
    const updatedMoveAction = await this.move(moveAction);
    await afterMoveActions(updatedMoveAction, this.activePlayer);
    await afterFinishTurn();
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

  async autoMove(availableActions: MoveAction[], player: Player) {
    const moveAction = chooseAction(availableActions, player);
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
      diceInfo: this.diceInfo
    });
  }

  turnDicePromise() {
    return new Promise((resolve, reject) => {
      if (!this.isPreviousMoveCompleted()) {
        // don't turn
        resolve();
        return;
      }

      if (this.activePlayer.isAI) {
        this.turnDice();
        resolve();
      } else {
        store.dispatch("board/update", {
          key: "boardStatus",
          value: BoardStatus.WAITING_TURN_DICE
        });

        this.$once("__turn_dice", () => {
          resolve();
        });
      }
    });
  }

  isPreviousMoveCompleted() {
    return this.diceInfo.isDone;
  }

  async turnDice() {
    store.dispatch("board/update", {
      key: "boardStatus",
      value: BoardStatus.TURNING_DICE,
      side: this.activePlayer.side
    });
    const result = Math.ceil(getRandom() * 6);
    await store.dispatch("board/update", {
      key: "diceInfo",
      value: createDiceInfo({
        value: result,
        isDone: false,
        player: this.activePlayer
      })
    });
    this.saveGame("turned dice");
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
  border-radius: $border-radius-sm;
  max-width: 100%;
  height: 100%;

  background-color: white;
  background-image: url("../assets/img/bg-diamond.svg");
}
.board-inner {
  position: relative;
  height: 100%;
}
.road {
  max-width: 100%;
  height: 100%;
  @include absolute-cover;
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

.fade-enter-to,
.fade-leave {
  opacity: 1;
}
.fade-leave-to,
.fade-enter {
  opacity: 0;
}

.menu {
  background-size: rem(32px);
  width: rem(32px);
  height: rem(32px);
}
.menu-icon {
  transition: all 300ms ease;
  position: absolute;

  background-size: rem(32px);
  width: rem(32px);
  height: rem(32px);
}

.menu-open {
  background: url("../assets/img/menu.svg") no-repeat center;
  &.fade-enter-to {
    transition-delay: 150ms;
  }
}
.menu-close {
  background: url("../assets/img/close.svg") no-repeat center;
  &.fade-enter-to {
    transition-delay: 150ms;
  }
}
</style>