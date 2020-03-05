<template>
  <div>
    <div v-if="shouldShowResult" class="dice" :class="`dice-${diceInfo.value}`" :style="getDiceStyle()"></div>
    <a
      :style="getTurnButtonStyle()"
      v-if="shouldShowWaitingDice"
      @click.prevent="onClickTurn()"
      class="turn-button"
      role="button"
    ></a>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { GameStatus, BoardStatus, Player, DiceInfo } from '@/types/types';
import { STEP_WIDTH, STEP_GUTTER } from '@/constants.ts';
import store from '@/store/index.ts';

@Component
export default class Dice extends Vue {
  BoardStatus = BoardStatus;

  get side(): number {
    if (!this.playerActive) {
      return 0;
    }
    return this.playerActive.side;
  }

  get playerActive(): Player {
    return store.getters['board/playerActive'];
  }

  get diceInfo(): DiceInfo {
    return store.getters['board/diceInfo'];
  }

  get boardWidth(): number {
    return store.getters['board/boardWidth'];
  }

  get boardStatus(): number {
    return store.getters['board/boardStatus'];
  }

  get shouldShowWaitingDice() {
    return [BoardStatus.WAITING_TURN_DICE].includes(this.boardStatus) && this.playerActive.isMain;
  }

  get shouldShowResult() {
    const result = [BoardStatus.TURNING_DICE, BoardStatus.PLAYER_IS_THINKING, BoardStatus.MOVING_MARBLES].includes(
      this.boardStatus
    );

    return result;
  }

  onClickTurn() {
    this.$emit('turn_dice');
  }

  getDiceStyle() {
    const result: any = {};
    const moveUnit = STEP_WIDTH + STEP_GUTTER;
    let moveAmountX = 0;
    let moveAmountY = 0;
    if (this.side === 1) {
      moveAmountX = 2.5 * moveUnit;
      moveAmountY = 7.5 * moveUnit;
    } else if (this.side === 2) {
      moveAmountX = 2.5 * moveUnit;
      moveAmountY = 2.5 * moveUnit;
    } else if (this.side === 3) {
      moveAmountX = 7.5 * moveUnit;
      moveAmountY = 2.5 * moveUnit;
    } else if (this.side === 4) {
      moveAmountX = 7.5 * moveUnit;
      moveAmountY = 7.5 * moveUnit;
    }
    result.transform = `
        translateX(${(moveAmountX / 100) * this.boardWidth}px)
        translateY(${(moveAmountY / 100) * this.boardWidth}px)
        `;
    return result;
  }

  getTurnButtonStyle() {
    const result: any = {};
    const moveUnit = STEP_WIDTH + STEP_GUTTER;
    let moveAmountX = 0;
    let moveAmountY = 0;
    if (this.side === 1) {
      moveAmountX = 2.5 * moveUnit;
      moveAmountY = 7.5 * moveUnit;
    } else if (this.side === 2) {
      moveAmountX = 2.5 * moveUnit;
      moveAmountY = 2.5 * moveUnit;
    } else if (this.side === 3) {
      moveAmountX = 7.5 * moveUnit;
      moveAmountY = 2.5 * moveUnit;
    } else if (this.side === 4) {
      moveAmountX = 7.5 * moveUnit;
      moveAmountY = 7.5 * moveUnit;
    }
    result.transform = `
        translateX(${(moveAmountX / 100) * this.boardWidth}px)
        translateY(${(moveAmountY / 100) * this.boardWidth}px)
        `;
    return result;
  }
}
</script>

<style lang="scss" scoped>
.dice {
  position: absolute;
  background: none no-repeat center;
  background-size: 100%;
  width: $step-width;
  height: $step-width;
}
.dice-1 {
  background-image: url('../assets/img/dice-1.svg');
}
.dice-2 {
  background-image: url('../assets/img/dice-2.svg');
}
.dice-3 {
  background-image: url('../assets/img/dice-3.svg');
}
.dice-4 {
  background-image: url('../assets/img/dice-4.svg');
}
.dice-5 {
  background-image: url('../assets/img/dice-5.svg');
}
.dice-6 {
  background-image: url('../assets/img/dice-6.svg');
}

.turn-button {
  position: absolute;
  width: $step-width;
  height: $step-width;
  background: url('../assets/img/turn-dice.svg') no-repeat center;
  background-size: 100%;
  cursor: pointer;
}
</style>
