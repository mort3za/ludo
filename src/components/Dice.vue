<template>
  <div class="dice" :class="`dice-${diceResult}`" :style="getStyle()"></div>
</template>


<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { Player } from "../types/types";
import { STEP_WIDTH, STEP_GUTTER } from "@/constants.ts";
import store from "@/store/index.ts";

@Component
export default class Dice extends Vue {
  @Prop({ type: Number })
  public diceResult!: number;

  @Prop({ type: Number })
  public side!: number;

  get boardWidth(): number {
    return store.getters["boardWidth"];
  }

  getStyle() {
    let result: any = {};
    const moveUnit = STEP_WIDTH + STEP_GUTTER;
    let moveAmountX: number = 0;
    let moveAmountY: number= 0;
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
        translateX(${moveAmountX / 100 * this.boardWidth}px)
        translateY(${(moveAmountY / 100 * this.boardWidth)}px)
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
  background-image: url("../assets/img/dice-1.svg");
}
.dice-2 {
  background-image: url("../assets/img/dice-2.svg");
}
.dice-3 {
  background-image: url("../assets/img/dice-3.svg");
}
.dice-4 {
  background-image: url("../assets/img/dice-4.svg");
}
.dice-5 {
  background-image: url("../assets/img/dice-5.svg");
}
.dice-6 {
  background-image: url("../assets/img/dice-6.svg");
}
</style>

