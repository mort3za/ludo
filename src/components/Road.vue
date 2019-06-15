<template>
  <div>
    <div class="road">
      <template v-for="step in steps">
        <Step
          :style="getStepStyle(step)"
          :row="step[0]"
          :column="step[1]"
          :side="step[2]"
          :types="step[3]"
          :key="`${step[0]}-${step[1]}-${step[2]}`"
          :class="[`step row-${step[0]} column-${step[1]}`]"
        />
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import store from "@/store/index";
import Step from "@/components/Step.vue";
import { Vue, Component } from "vue-property-decorator";
import {StepPlace} from "@/types/types"
import { STEP_WIDTH, STEP_GUTTER } from '../constants';

@Component({
  components: {
    Step
  }
})
export default class RoadComponent extends Vue {
  data() {
    return {
      steps: store.getters["steps/allSteps"] as StepPlace[]
    }
  }

  getStepStyle(step: StepPlace) {
    const row = step[0]
    const column = step[1]
    
    return {
      top: `${(row - 1) * (STEP_WIDTH + STEP_GUTTER) + "%"}`,
      left: `${(column - 1) * (STEP_WIDTH + STEP_GUTTER) + "%"}`
    }
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
</style>