<template>
  <div>
    <div class="grid">
      <template v-for="step in steps">
        <Step
          :style="{'grid-row-start': step.row, 'grid-column-start': step.column}"
          :type="step.type"
          :row="step.row"
          :column="step.column"
          :key="`${step.side}-${step.row}-${step.column}`"
        />
      </template>
    </div>
  </div>
</template>

<script>
import Step from "@/components/Step.vue";
import { generateSteps } from "@/helpers.ts";
export default {
  name: "road",
  data() {
    return {
      steps: generateSteps()
    };
  },
  components: {
    Step
  }
};
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