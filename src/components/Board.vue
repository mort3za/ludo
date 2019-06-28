<template>
  <div class="board-w mx-auto py-3">
    <div class="toolbar d-flex">
      <a class="menu-toggle d-block mx-3 mb-3" href="#" @click.prevent="menuToggle()"></a>
    </div>
    <div class="mx-3">
      <div class="aspect-ratio-box mb-3">
        <div class="aspect-ratio-box-inside">
          <section class="board shadow-sm p-3">
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
      await this.autoMove(availableActions, this.activePlayer);
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
  // box-shadow: 1px 1px 3px $gray-60;
  border-radius: $border-radius-sm;
  max-width: 100%;
  height: 100%;
  // width: rem($board-width) + $grid-gutter-width * 2;
  // height: rem($board-width) + $grid-gutter-width * 2;

  background-color: white;
  background-image: url("data:image/svg+xml,%3Csvg width='180' height='180' viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M81.28 88H68.413l19.298 19.298L81.28 88zm2.107 0h13.226L90 107.838 83.387 88zm15.334 0h12.866l-19.298 19.298L98.72 88zm-32.927-2.207L73.586 78h32.827l.5.5 7.294 7.293L115.414 87l-24.707 24.707-.707.707L64.586 87l1.207-1.207zm2.62.207L74 80.414 79.586 86H68.414zm16 0L90 80.414 95.586 86H84.414zm16 0L106 80.414 111.586 86h-11.172zm-8-6h11.173L98 85.586 92.414 80zM82 85.586L87.586 80H76.414L82 85.586zM17.414 0L.707 16.707 0 17.414V0h17.414zM4.28 0L0 12.838V0h4.28zm10.306 0L2.288 12.298 6.388 0h8.198zM180 17.414L162.586 0H180v17.414zM165.414 0l12.298 12.298L173.612 0h-8.198zM180 12.838L175.72 0H180v12.838zM0 163h16.413l.5.5 7.294 7.293L25.414 172l-8 8H0v-17zm0 10h6.613l-2.334 7H0v-7zm14.586 7l7-7H8.72l-2.333 7h8.2zM0 165.414L5.586 171H0v-5.586zM10.414 171L16 165.414 21.586 171H10.414zm-8-6h11.172L8 170.586 2.414 165zM180 163h-16.413l-7.794 7.793-1.207 1.207 8 8H180v-17zm-14.586 17l-7-7h12.865l2.333 7h-8.2zM180 173h-6.613l2.334 7H180v-7zm-21.586-2l5.586-5.586 5.586 5.586h-11.172zM180 165.414L174.414 171H180v-5.586zm-8 5.172l5.586-5.586h-11.172l5.586 5.586zM152.933 25.653l1.414 1.414-33.94 33.942-1.416-1.416 33.943-33.94zm1.414 127.28l-1.414 1.414-33.942-33.94 1.416-1.416 33.94 33.943zm-127.28 1.414l-1.414-1.414 33.94-33.942 1.416 1.416-33.943 33.94zm-1.414-127.28l1.414-1.414 33.942 33.94-1.416 1.416-33.94-33.943zM0 85c2.21 0 4 1.79 4 4s-1.79 4-4 4v-8zm180 0c-2.21 0-4 1.79-4 4s1.79 4 4 4v-8zM94 0c0 2.21-1.79 4-4 4s-4-1.79-4-4h8zm0 180c0-2.21-1.79-4-4-4s-4 1.79-4 4h8z' fill='%23d6e6ec' fill-opacity='0.2' fill-rule='evenodd'/%3E%3C/svg%3E");
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