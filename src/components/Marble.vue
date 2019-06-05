<template>
  <span @click="onClickMarble" class="marble-w" :style="getStyle()">
    <span class="marble d-block" :class="[`is-side-${model.side}`, {moveable: model.isMoveable}]"></span>
  </span>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { Marble, PositionInBoard } from "@/types/types";

@Component({
  props: {
    model: {
      type: Object as () => Marble,
      required: true
    }
  }
})
export default class MarbleComponent extends Vue {
  getStyle() {
    return {
      transform: `
        translateX(${(this.model.column - 1) * 44 + "px"})
        translateY(${(this.model.row - 1) * 44 + "px"})
        `
    };
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
}
.marble {
  width: rem(40px);
  height: rem(40px);
  border-radius: 100%;
  box-shadow: rem(2px 2px 2px) $gray-60;
  background: $light url("../assets/img/flower.svg") no-repeat center;
  background-size: rem(32px);
  // will-change: transform;
}
.is-side-1 {
  background-color: $brand-1;
}
.is-side-2 {
  background-color: $brand-2;
}
.is-side-3 {
  background-color: $brand-3;
}
.is-side-4 {
  background-color: $brand-4;
}

.moveable {
  // animation: 1s moving infinite reverse linear;
  border: rem(4px) solid $dark;
}

$move-amount: rem(4px);

@keyframes moving {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(- $move-amount);
  }
}
</style>
