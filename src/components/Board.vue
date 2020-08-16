<template>
  <div ref="el" class="board-w mx-auto py-3" @keyup.space="keySpacePressed()" @keyup.esc="menuToggle()" tabindex="0">
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
import { defineComponent, onMounted, onUnmounted, ref, Ref } from '@vue/composition-api';
import { useGetters } from '@u3u/vue-hooks';

export default defineComponent({
  name: 'board',
  components: {
    Dice,
    Road,
    Marbles,
    MenuBoard
  },
  setup(props, context) {
    const boardInner = ref(null) as Ref<HTMLDivElement>;
    const boardWidthUpdaterDebounced = debounce(function() {
      boardWidthUpdater({ boardElement: boardInner.value });
    }, 150);
    const el = ref(null) as Ref<HTMLDivElement>;

    const gameStatus = useGetters(['gameStatus']) as unknown as Ref<GameStatus>;

    function resizeListener() {
      window.addEventListener('resize', boardWidthUpdaterDebounced);
    }
    function removeResizeListener() {
      window.removeEventListener('resize', boardWidthUpdaterDebounced);
    }

    function init() {
      boardWidthUpdaterDebounced();
      resizeListener();
    }

    function continueGame() {
      if (gameStatus.value === GameStatus.PLAYING) {
        console.log('continue game');
        playTurn();
      }
    }

    function resumePromise() {
      return new Promise((resolve, reject) => {
        if (gameStatus.value === GameStatus.PLAYING) {
          resolve();
        } else if (gameStatus.value === GameStatus.PAUSED) {
          this.$once('__resume_game', () => {
            resolve();
          });
        }
      });
    }

    async function resumeGame() {
      await store.dispatch('updateGameStatus', GameStatus.PLAYING);
      setShowMenu(false);
      context.emit('__resume_game');
    }

    async function _startGame() {
      await startGame();
      playTurn();
    }

    function shouldChangeTurn(): boolean {
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

    function menuToggle() {
      setShowMenu(!this.shouldShowMenu);
    }

    async function playTurn() {
      // console.log("------------------------------------ play turn");
      if (this.isGameOver) {
        finishGame();
        return;
      }
      await resumePromise();
      if (shouldChangeTurn()) {
        changeTurn();
      }
      await turnDicePromise();

      // TODO: remove if is unnecessary
      await sleepBetweenTurns();

      const performActionsOfPlayer = this.playerActive.isAI
        ? this.performActionsOfPlayerAI
        : this.performActionsOfPlayerNoAI;
      await performActionsOfPlayer();
    }

    async function sleepBetweenTurns() {
      await wait(SLEEP_BETWEEN_TURNS);
    }

    async function performActionsOfPlayerAI() {
      const availableActions = _getAvailableActions();

      if (availableActions.length === 0) {
        // console.log("---- no action ----");
        await afterFinishTurn();
        playTurn();
      } else if (shouldAutoMove(availableActions)) {
        // console.log("auto move");
        await autoMove(availableActions, this.playerActive);
        await afterFinishTurn();
        playTurn();
      }
    }

    async function performActionsOfPlayerNoAI() {
      const availableActions = _getAvailableActions();

      // console.log("Human move (wait or skip)");
      if (availableActions.length > 0) {
        setMoveableMarbles(availableActions);
        store.dispatch('board/update', {
          key: 'boardStatus',
          value: BoardStatus.PLAYER_IS_THINKING
        });
      } else {
        await afterFinishTurn();
        playTurn();
      }
    }

    async function onClickMarble(marble: Marble) {
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
      playTurn();
    }

    function setMoveableMarbles(availableActions: MoveAction[]): void {
      const marbles: Marble[] = availableActions.map(action => action.marble);
      store.dispatch('marbles/setMoveableItems', marbles);
    }

    function shouldAutoMove(availableActions: MoveAction[]): boolean {
      return this.playerActive.isAI || !hasMultipleAvailableActions(availableActions);
    }

    async function autoMove(availableActions: MoveAction[], player: Player) {
      const moveAction = chooseAction(availableActions, player);
      beforeMoveActions(moveAction, this.playerActive);
      const updatedMoveAction = await this.move(moveAction);
      await afterMoveActions(updatedMoveAction, this.playerActive);
    }

    async function move(moveAction: MoveAction): Promise<MoveAction> {
      const updatedMoveAction = await moveStepByStep(moveAction);
      // console.log("* move done *", moveAction);
      return updatedMoveAction;
    }

    function _getAvailableActions(): MoveAction[] {
      return getAvailableActions({
        player: this.playerActive,
        diceInfo: this.diceInfo
      });
    }

    async function turnDicePromise() {
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
        return await _turnDice();
      }
      // noAI: click on dice:
      return new Promise(resolve => {
        this.$once('__turn_dice', resolve);
      });
    }

    async function _turnDice() {
      await turnDice(this.playerActive);
      context.emit('__turn_dice');
      await wait(SLEEP_AFTER_TURN_DICE);
    }

    function keySpacePressed() {
      if (!this.playerActive.isMain || this.boardStatus != BoardStatus.WAITING_TURN_DICE) {
        return;
      }
      _turnDice();
    }

    onUnmounted(() => {
      removeResizeListener();
      store.dispatch('updateGameStatus', GameStatus.NOT_STARTED);
    });

    onMounted(() => {
      init();
      continueGame();
    });

    return {
      el,
      boardInner,
      resizeListener,
      removeResizeListener,
      init,
      continueGame,
      resumePromise,
      resumeGame,
      _startGame,
      shouldChangeTurn,
      menuToggle,
      playTurn,
      sleepBetweenTurns,
      performActionsOfPlayerAI,
      performActionsOfPlayerNoAI,
      onClickMarble,
      setMoveableMarbles,
      shouldAutoMove,
      autoMove,
      move,
      _getAvailableActions,
      turnDicePromise,
      _turnDice,
      keySpacePressed
    };
  },
  computed: {
    shouldShowMenu(): boolean {
      return store.getters['board/shouldShowMenu'];
    },
    boardStatus(): BoardStatus {
      return store.getters['board/boardStatus'];
    },
    playerActive(): Player {
      return store.getters['board/playerActive'];
    },
    playerWinner(): Player {
      return store.getters['board/playerWinner'];
    },
    diceInfo(): DiceInfo {
      return store.getters['board/diceInfo'];
    },
    isGameOver(): boolean {
      if (!this.playerActive) {
        return false;
      }
      return store.getters['marbles/isAllAtFinal'](this.playerActive);
    },
    isPreviousMoveCompleted(): boolean {
      return this.diceInfo.isDone;
    }
  }
});
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
