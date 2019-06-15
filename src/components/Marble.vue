<template>
  <span
    @click="onClickMarble"
    class="marble"
    :class="[{moveable: model.isMoveable}, `is-side-${model.side}`]"
    :style="getWrapperStyle()"
  >
    <span class="inner d-block" :class="getMarbleClasses()" :style="getMarbleStyle()"></span>
  </span>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { Marble, PositionInBoard } from "@/types/types";
import { STEP_WIDTH, STEP_GUTTER } from "@/constants.ts";
import store from "@/store/index.ts";

@Component
export default class MarbleComponent extends Vue {
  @Prop({ type: Object as () => Marble })
  public model!: Marble;

  get countOnPlace() {
    // get count of marbles in the current StepPlace
    // TODO: implement
    return 1;
  }

  get boardWidth(): number {
    return store.getters["boardWidth"];
  }

  getWrapperStyle() {
    const column = this.model.column;
    const row = this.model.row;
    const moveUnit = (STEP_WIDTH + STEP_GUTTER) * this.boardWidth;
    return {
      transform: `
        translateX(${(column - 1) * (moveUnit / 100) + "px"})
        translateY(${(row - 1) * (moveUnit / 100) + "px"})
        `
    };
  }

  getMarbleClasses() {
    const { isMoving } = this.model;
    if (isMoving) {
      return [];
    }

    return [
      {
        [`multiple-${this.countOnPlace}`]: this.countOnPlace > 1,
        multiple: this.countOnPlace > 1
      }
    ];
  }

  getMarbleStyle() {
    let style: any = {};
    const side = this.model.side;

    if (this.countOnPlace >= 2) {
      if (side === 1) {
        style.left = 0;
        style.bottom = 0;
      } else if (side === 2) {
        style.left = 0;
        style.top = 0;
      } else if (side === 3) {
        style.right = 0;
        style.top = 0;
      } else if (side === 4) {
        style.right = 0;
        style.bottom = 0;
      }
    }
    return style;
  }

  onClickMarble() {
    this.$emit("clickmarble", this.model);
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
  transition: width #{$marble-animation-duration / 2}ms ease,
    height #{$marble-animation-duration / 2}ms ease;
  width: 100%;
  height: 100%;
  border-radius: 100%;
  box-shadow: rem(2px 2px 2px) $gray-60;
  border: rem(4px) solid $light;
  background: $light url("../assets/img/flower.svg") no-repeat center;
  background-size: 86%;
  position: absolute;
  // &.multiple {
  //   width: rem($step-width / 2);
  //   height: rem($step-width / 2);
  //   background-size: rem(16px);
  // }
}
// .multiple {
//   box-shadow: rem(2px 2px 2px) $gray-60;
//   border: rem(2px) solid $light;
// }
.moveable {
  cursor: pointer;
  .inner {
    box-shadow: 0 0 0 rem(4px) $dark-less inset, rem(2px 2px 2px) $gray-60;
    border: none;
  }
  // .multiple {
  //   box-shadow: 0 0 0 rem(2px) $dark-less inset, rem(2px 2px 2px) $gray-60;
  // }
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
