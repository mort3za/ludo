<template>
  <div>
    <div class="road">
      <div>
        <Step
          v-for="step in steps"
          :style="getStepStyle(step)"
          :row="step[0]"
          :column="step[1]"
          :side="step[2]"
          :types="step[3]"
          :key="`${step[0]}-${step[1]}-${step[2]}`"
          :class="[`step row-${step[0]} column-${step[1]}`]"
        />
      </div>
      <div>
        <p
          v-for="player in players"
          :key="`player-name-${player.id}`"
          :class="`player-name-${player.side}`"
          class="mb-2 player-name"
        >{{player.name}}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import store from "@/store/index";
import Step from "@/components/Step.vue";
import { Vue, Component } from "vue-property-decorator";
import { StepPlace, Player } from "@/types/types";
import { STEP_WIDTH, STEP_GUTTER } from "../constants";

@Component({
  components: {
    Step
  }
})
export default class RoadComponent extends Vue {
  steps = store.getters["steps/allSteps"] as StepPlace[];

  get players(): Player[] {
    return store.getters["players/list"];
  }

  getStepStyle(step: StepPlace) {
    const row = step[0];
    const column = step[1];

    return {
      top: `${(row - 1) * (STEP_WIDTH + STEP_GUTTER) + "%"}`,
      left: `${(column - 1) * (STEP_WIDTH + STEP_GUTTER) + "%"}`
    };
  }
}
</script>

<style lang="scss" scoped>
.road {
  margin: auto;
}
.step {
  position: absolute;
}
.player-name {
  position: absolute;
  margin-bottom: 0;
  font-size: $font-size-sm;
}
.player-name-1 {
  bottom: 2 * ($step-width + $step-gutter);
  left: 0;
  margin-bottom: rem(16px);
}
.player-name-2 {
  top: 2 * ($step-width + $step-gutter);
  margin-top: rem(16px);
  left: 0
}
.player-name-3 {
  top: 2 * ($step-width + $step-gutter);
  margin-top: rem(16px);
  right: 0;
  text-align: right;
}
.player-name-4 {
  bottom: 2 * ($step-width + $step-gutter);
  right: 0;
  margin-bottom: rem(16px);
  text-align: right;
}
</style>