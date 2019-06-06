<template>
  <span
    @click="onClickMarble"
    class="marble-w"
    :class="[{moveable: model.isMoveable}, `is-side-${model.side}`]"
    :style="getStyleWrapper()"
  >
    <span
      class="marble d-block"
      :class="[{[`multiple-${model.countOnPlace}`]: model.countOnPlace > 1, 'multiple': model.countOnPlace > 1}]"
      :style="getStyleInner()"
    ></span>
  </span>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { Marble, PositionInBoard } from "@/types/types";

const STEP_WIDTH = 40;

@Component
export default class MarbleComponent extends Vue {
  @Prop({ type: Object as () => Marble })
  public model!: Marble;

  getStyleWrapper() {
    return {
      transform: `
        translateX(${(this.model.column - 1) * (STEP_WIDTH + 4) + "px"})
        translateY(${(this.model.row - 1) * (STEP_WIDTH + 4) + "px"})
        `
    };
  }

  getStyleInner() {
    let style: any = {};
    const countOnPlace: number = this.model.countOnPlace || 1;
    const side = this.model.side;
    const relative_move = `${STEP_WIDTH / 2}px`
    
    if (countOnPlace >= 2) {
      if (side === 1) {
        style.left = 0;
        style.top = relative_move;
      }
      else if (side === 2) {
        style.left = 0;
        style.top = 0;
      }
      else if (side === 3) {
        style.left = relative_move;
        style.top = 0;
        console.log('3:', style);
        
      }
      else if (side === 4) {
        style.left = relative_move;
        style.top = relative_move;
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
.marble-w {
  position: absolute;
  transition: transform 1s ease;
  width: rem($step-width);
  height: rem($step-width);
}
.marble {
  width: rem($step-width);
  height: rem($step-width);
  border-radius: 100%;
  box-shadow: rem(2px 2px 2px) $gray-60;
  border: rem(4px) solid $light;
  background: $light url("../assets/img/flower.svg") no-repeat center;
  background-size: rem(32px);
  position: absolute;
  // will-change: transform;
  &.multiple {
    width: rem($step-width / 2);
    height: rem($step-width / 2);
    background-size: rem(16px);
  }
}
.multiple {
  box-shadow: rem(2px 2px 2px) $gray-60;
  border: rem(2px) solid $light;
}
.moveable {
  .marble {
    box-shadow: 0 0 0 rem(4px) $dark-less inset, rem(2px 2px 2px) $gray-60;
    border: none;
  }
  .multiple {
    box-shadow: 0 0 0 rem(2px) $dark-less inset, rem(2px 2px 2px) $gray-60;
  }
}

.is-side-1 {
  z-index: 1;
  .marble {
    background-color: $brand-1;
  }
}
.is-side-2 .marble {
  background-color: $brand-2;
}
.is-side-3 .marble {
  background-color: $brand-3;
}
.is-side-4 .marble {
  background-color: $brand-4;
}

$move-amount: rem(4px);

@keyframes moving {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-$move-amount);
  }
}
</style>
