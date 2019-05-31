<template>
  <div>
    <div class="grid">
      <template v-for="step in steps">
        <Step
          :style="{'grid-row-start': step[0], 'grid-column-start': step[1]}"
          :types="step[3]"
          :row="step[0]"
          :column="step[1]"
          :key="`${step[0]}-${step[1]}-${step[2]}`"
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
}
</script>

<style lang="scss" scoped>
.grid {
  margin: auto;
  display: grid;
  grid-template-columns: repeat(11, rem(40px));
  grid-template-rows: repeat(11, rem(40px));
  grid-gap: rem(4px);
  justify-items: center;
  align-items: center;
}
</style>