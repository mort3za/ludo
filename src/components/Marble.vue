<template>
  <span
    @click="onClickMarble"
    class="marble"
    :class="[{ moveable: model.isMoveable, 'is-moving': model.isMoving }, `is-side-${model.side}`]"
    :style="getWrapperStyle()"
  >
    <span class="inner d-block" :class="{ 'is-at-final': model.isAtFinal, 'no-animation': noAnimation }"></span>
  </span>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { Marble, PositionInBoard } from '@/types/types';
import { STEP_WIDTH, STEP_GUTTER } from '@/constants.ts';
import store from '@/store/index.ts';

@Component
export default class MarbleComponent extends Vue {
  noAnimation = false;

  @Prop({ type: Object as () => Marble })
  public model!: Marble;

  mounted() {
    // no animation on refresh page
    if (this.model.isAtFinal) {
      this.noAnimation = true;
    }
  }

  get boardWidth(): number {
    return store.getters['board/boardWidth'];
  }

  getWrapperStyle() {
    const column = this.model.column;
    const row = this.model.row;
    const moveUnit = (STEP_WIDTH + STEP_GUTTER) * this.boardWidth;
    return {
      transform: `
        translateX(${(column - 1) * (moveUnit / 100) + 'px'})
        translateY(${(row - 1) * (moveUnit / 100) + 'px'})
        `
    };
  }

  onClickMarble() {
    this.$emit('clickmarble', this.model);
  }
}
</script>

<style lang="scss" scoped>
.marble {
  position: absolute;
  transition: transform #{$marble-animation-duration}ms ease;
  width: $step-width;
  height: $step-width;
}
.inner {
  transition: width #{$marble-animation-duration / 2}ms ease, height #{$marble-animation-duration / 2}ms ease;
  width: 100%;
  height: 100%;
  border-radius: 100%;
  box-shadow: rem(2px 2px 2px) $gray-60;
  border: rem(4px) solid $light;
  background: $light url('../assets/img/flower.svg') no-repeat center;
  background-size: 86%;
  &.is-at-final {
    // transition: transform 300ms ease-in-bounce #{$marble-animation-duration}ms;
    animation: #{$marble-go-to-heaven-duration}ms linear 0s 1 scale-easeInBounce;
    transform: scale(0);
  }
  &.no-animation {
    animation: none;
  }
}
.moveable {
  cursor: pointer;
  .inner {
    box-shadow: 0 0 0 rem(4px) $dark-less inset, rem(2px 2px 2px) $gray-60;
    border: none;
  }
}
.is-moving,
.moveable {
  z-index: 1;
}

.is-side-1 {
  z-index: 1;
  .inner {
    background-color: $brand-1;
  }
}
.is-side-2 .inner {
  background-color: $brand-2;
}
.is-side-3 .inner {
  background-color: $brand-3;
}
.is-side-4 .inner {
  background-color: $brand-4;
}
</style>
