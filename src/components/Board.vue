<template>
  <div class="board-w mx-auto py-3" @keyup.space="keySpacePressed()" @keyup.esc="menuToggle()" tabindex="0">
    <div class="toolbar d-flex">
      <a class="menu position-relative d-block mx-3 mb-3" href="#" @click.prevent="menuToggle()" aria-label="Main menu">
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
              <Dice @turn_dice="_turnDice()" />
            </div>
          </section>
          <MenuBoard v-show="shouldShowMenu" @start_game="_startGame()" @resume_game="resumeGame()" />
        </div>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import store from '@/store/index';
import Road from '@/components/Road.vue';
import Dice from '@/components/Dice.vue';
import Marbles from '@/components/Marbles.vue';
import MenuBoard from '@/components/MenuBoard.vue';
import { Vue, Component } from 'vue-property-decorator';
import { Player, MoveAction, Marble, BoardStatus, GameStatus, DiceInfo } from '@/types/types';
import {
  getAvailableActions,
  chooseAction,
  hasMultipleAvailableActions,
  canMove,
  afterMoveActions,
  moveStepByStep,
  beforeMoveActions,
  afterFinishTurn,
  createMoveAction,
  wait,
  turnDice,
  setShowMenu,
  startGame,
  finishGame,
  changeTurn,
  boardWidthUpdater
} from '@/helpers';
import { SLEEP_BETWEEN_TURNS, SLEEP_AFTER_TURN_DICE } from '@/constants.ts';
import { debounce } from 'lodash-es';

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

  mounted() {
    this.init();
    this.continueGame();
  }
  destroyed() {
    this.removeResizeListener();
    store.dispatch('updateGameStatus', GameStatus.NOT_STARTED);
  }

  get shouldShowMenu(): boolean {
    return store.getters['board/shouldShowMenu'];
  }
  get boardStatus(): BoardStatus {
    return store.getters['board/boardStatus'];
  }
  get playerActive(): Player {
    return store.getters['board/playerActive'];
  }
  get playerWinner(): Player {
    return store.getters['board/playerWinner'];
  }
  get diceInfo(): DiceInfo {
    return store.getters['board/diceInfo'];
  }
  get isGameOver(): boolean {
    if (!this.playerActive) {
      return false;
    }
    return store.getters['marbles/isAllAtFinal'](this.playerActive);
  }
  get gameStatus(): GameStatus {
    return store.getters['gameStatus'];
  }
  get isPreviousMoveCompleted(): boolean {
    return this.diceInfo.isDone;
  }

  init() {
    this.boardWidthUpdater();
    this.resizeListener();
    this.focusBoard();
  }

  continueGame() {
    if (this.gameStatus === GameStatus.PLAYING) {
      console.log('continue game');
      this.focusBoard();
      this.playTurn();
    }
  }

  focusBoard() {
    // @ts-ignore
    this.$el.focus();
  }

  resumePromise() {
    return new Promise((resolve, reject) => {
      if (this.gameStatus === GameStatus.PLAYING) {
        resolve();
      } else if (this.gameStatus === GameStatus.PAUSED) {
        this.$once('__resume_game', () => {
          resolve();
        });
      }
    });
  }

  async resumeGame() {
    await store.dispatch('updateGameStatus', GameStatus.PLAYING);
    setShowMenu(false);
    this.focusBoard();
    this.$emit('__resume_game');
  }

  async _startGame() {
    await startGame();
    this.focusBoard();
    this.playTurn();
  }

  shouldChangeTurn(): boolean {
    if (!this.diceInfo.value) {
      return true;
    }
    if (this.isPreviousMoveCompleted === false) {
      return false;
    }

    if (this.diceInfo.hasReward) {
      return false;
    }
    return true;
  }

  menuToggle() {
    setShowMenu(!this.shouldShowMenu);
  }

  async playTurn() {
    // console.log("------------------------------------ play turn");
    if (this.isGameOver) {
      finishGame();
      return;
    }
    await this.resumePromise();
    if (this.shouldChangeTurn()) {
      changeTurn();
    }
    await this.turnDicePromise();

    // TODO: remove if is unnecessary
    await this.sleepBetweenTurns();

    const performActionsOfPlayer = this.playerActive.isAI
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
      await this.autoMove(availableActions, this.playerActive);
      await afterFinishTurn();
      this.playTurn();
    }
  }

  async performActionsOfPlayerNoAI() {
    const availableActions = this.getAvailableActions();

    // console.log("Human move (wait or skip)");
    if (availableActions.length > 0) {
      this.setMoveableMarbles(availableActions);
      store.dispatch('board/update', {
        key: 'boardStatus',
        value: BoardStatus.PLAYER_IS_THINKING
      });
    } else {
      await afterFinishTurn();
      this.playTurn();
    }
  }

  async onClickMarble(marble: Marble) {
    if (!canMove(marble, this.playerActive)) return;
    const moveAction = createMoveAction({
      player: this.playerActive,
      marble,
      diceInfo: this.diceInfo
    });

    beforeMoveActions(moveAction, this.playerActive);
    const updatedMoveAction = await this.move(moveAction);
    await afterMoveActions(updatedMoveAction, this.playerActive);
    await afterFinishTurn();
    this.playTurn();
  }

  setMoveableMarbles(availableActions: MoveAction[]): void {
    const marbles: Marble[] = availableActions.map(action => action.marble);
    store.dispatch('marbles/setMoveableItems', marbles);
  }

  shouldAutoMove(availableActions: MoveAction[]): boolean {
    return this.playerActive.isAI || !hasMultipleAvailableActions(availableActions);
  }

  async autoMove(availableActions: MoveAction[], player: Player) {
    const moveAction = chooseAction(availableActions, player);
    beforeMoveActions(moveAction, this.playerActive);
    const updatedMoveAction = await this.move(moveAction);
    await afterMoveActions(updatedMoveAction, this.playerActive);
  }

  async move(moveAction: MoveAction): Promise<MoveAction> {
    const updatedMoveAction = await moveStepByStep(moveAction);
    // console.log("* move done *", moveAction);
    return updatedMoveAction;
  }

  getAvailableActions(): MoveAction[] {
    return getAvailableActions({
      player: this.playerActive,
      diceInfo: this.diceInfo
    });
  }

  async turnDicePromise() {
    // don't turn (after refresh when game is running)
    if (this.isPreviousMoveCompleted === false) {
      console.log('dont turn');
      return Promise.resolve();
    }

    // waiting
    store.dispatch('board/update', {
      key: 'boardStatus',
      value: BoardStatus.WAITING_TURN_DICE
    });

    // AI: auto turn
    if (this.playerActive.isAI) {
      return await this._turnDice();
    }
    // noAI: click on dice:
    return new Promise(resolve => {
      this.$once('__turn_dice', resolve);
    });
  }

  async _turnDice() {
    await turnDice(this.playerActive);
    this.$emit('__turn_dice');
    await wait(SLEEP_AFTER_TURN_DICE);
  }

  keySpacePressed() {
    if (!this.playerActive.isMain || this.boardStatus != BoardStatus.WAITING_TURN_DICE) {
      return;
    }
    this._turnDice();
  }

  boardWidthUpdater() {
    // @ts-ignore
    boardWidthUpdater({ boardElement: this.$refs.boardInner });
  }

  resizeListener() {
    window.addEventListener('resize', this.boardWidthUpdaterDebounced);
  }
  removeResizeListener() {
    window.removeEventListener('resize', this.boardWidthUpdaterDebounced);
  }
}
</script>

<style lang="scss">
.board-w {
  max-width: $board-width;
  &:focus {
    outline: none;
  }
}
.board {
  background: $light;
  border-radius: $border-radius-sm;
  max-width: 100%;
  height: 100%;

  background-color: white;
  background-image: url('../assets/img/bg-diamond.svg');
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
  background: url('../assets/img/menu.svg') no-repeat center;
  &.fade-enter-to {
    transition-delay: 150ms;
  }
}
.menu-close {
  background: url('../assets/img/close.svg') no-repeat center;
  &.fade-enter-to {
    transition-delay: 150ms;
  }
}
</style>
