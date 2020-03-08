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
import { BoardStatus, Player } from '@/types/types';
import { STEP_WIDTH, STEP_GUTTER } from '@/constants.ts';
import { defineComponent, computed, Ref } from '@vue/composition-api';
import { useGetters } from '@u3u/vue-hooks';

export default defineComponent({
  name: 'dice',
  setup(props, context) {
    const getters = {
      ...useGetters('board', ['playerActive', 'diceInfo', 'boardWidth', 'boardStatus'])
    };
    const playerActive = (getters.playerActive as unknown) as Ref<Player>;
    const boardWidth = (getters.boardWidth as unknown) as Ref<number>;
    const boardStatus = (getters.boardStatus as unknown) as Ref<number>;
    const side = (computed(() => {
      if (!playerActive.value) {
        return 0;
      }
      return playerActive.value.side;
    }) as unknown) as Ref<number>;

    const shouldShowWaitingDice = computed(() => {
      return [BoardStatus.WAITING_TURN_DICE].includes(boardStatus.value) && playerActive.value.isMain;
    });

    const shouldShowResult = computed(() => {
      const result = [BoardStatus.TURNING_DICE, BoardStatus.PLAYER_IS_THINKING, BoardStatus.MOVING_MARBLES].includes(
        boardStatus.value
      );

      return result;
    });

    function onClickTurn() {
      context.emit('turn_dice');
    }

    function getDiceStyle() {
      const result: Record<string, any> = {};
      const moveUnit = STEP_WIDTH + STEP_GUTTER;
      let moveAmountX = 0;
      let moveAmountY = 0;
      if (side.value === 1) {
        moveAmountX = 2.5 * moveUnit;
        moveAmountY = 7.5 * moveUnit;
      } else if (side.value === 2) {
        moveAmountX = 2.5 * moveUnit;
        moveAmountY = 2.5 * moveUnit;
      } else if (side.value === 3) {
        moveAmountX = 7.5 * moveUnit;
        moveAmountY = 2.5 * moveUnit;
      } else if (side.value === 4) {
        moveAmountX = 7.5 * moveUnit;
        moveAmountY = 7.5 * moveUnit;
      }
      result.transform = `
        translateX(${(moveAmountX / 100) * boardWidth.value}px)
        translateY(${(moveAmountY / 100) * boardWidth.value}px)
        `;
      return result;
    }

    function getTurnButtonStyle() {
      const result: Record<string, any> = {};
      const moveUnit = STEP_WIDTH + STEP_GUTTER;
      let moveAmountX = 0;
      let moveAmountY = 0;
      if (side.value === 1) {
        moveAmountX = 2.5 * moveUnit;
        moveAmountY = 7.5 * moveUnit;
      } else if (side.value === 2) {
        moveAmountX = 2.5 * moveUnit;
        moveAmountY = 2.5 * moveUnit;
      } else if (side.value === 3) {
        moveAmountX = 7.5 * moveUnit;
        moveAmountY = 2.5 * moveUnit;
      } else if (side.value === 4) {
        moveAmountX = 7.5 * moveUnit;
        moveAmountY = 7.5 * moveUnit;
      }
      result.transform = `
        translateX(${(moveAmountX / 100) * boardWidth.value}px)
        translateY(${(moveAmountY / 100) * boardWidth.value}px)
        `;
      return result;
    }

    return {
      ...getters,
      side,
      shouldShowWaitingDice,
      shouldShowResult,
      BoardStatus,
      onClickTurn,
      getDiceStyle,
      getTurnButtonStyle
    };
  }
});
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
