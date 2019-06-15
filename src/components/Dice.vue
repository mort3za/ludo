<template>
  <div class="dice" :class="`dice-${diceResult}`" :style="getStyle()"></div>
</template>


<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { Player } from "../types/types";
import { STEP_WIDTH } from "@/constants.ts";

@Component
export default class Dice extends Vue {
  @Prop({ type: Number })
  public diceResult!: number;

  @Prop({ type: Number })
  public side!: number;

  getStyle() {
    let result: any = {};
    const moveUnit = STEP_WIDTH + 4
    if (this.side === 1) {
      const moveAmountX = `${2.5 * moveUnit}px`;
      const moveAmountY = `${7.5 * moveUnit}px`;
      result.transform = `
        translateX(${moveAmountX})
        translateY(${moveAmountY})
        `;
    } else if (this.side === 2) {
      const moveAmountX = `${2.5 * moveUnit}px`;
      const moveAmountY = `${2.5 * moveUnit}px`;
      result.transform = `
        translateX(${moveAmountX})
        translateY(${moveAmountY})
        `;
    } 
    else if (this.side === 3) {
      const moveAmountX = `${7.5 * moveUnit}px`;
      const moveAmountY = `${2.5 * moveUnit}px`;
      result.transform = `
        translateX(${moveAmountX})
        translateY(${moveAmountY})
        `;
    } else if (this.side === 4) {
      const moveAmountX = `${7.5 * moveUnit}px`;
      const moveAmountY = `${7.5 * moveUnit}px`;
      result.transform = `
        translateX(${moveAmountX})
        translateY(${moveAmountY})
        `;
    }
    return result;
  }
}
</script>

<style lang="scss" scoped>
.dice {
  background: none no-repeat center;
  background-size: $step-width;
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

