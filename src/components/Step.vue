<template>
  <span class="d-flex step justify-content-center align-content-center font-size-sm"></span>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { StepType } from "../types/types";

@Component
export default class StepComponent extends Vue {
  @Prop({ type: Number, required: true })
  public row!: number;

  @Prop({ type: Number, required: true })
  public column!: number;

  @Prop({ type: Array as () => StepType[], required: true })
  public types!: StepType[];
}
</script>

<style lang="scss" scoped>
.step {
  width: rem(40px);
  height: rem(40px);
  border-radius: 100%;
  background: $gray-96;
  box-shadow: 0 0 rem(2px) $dark inset;
}

.is-startpoint-1 {
  border: rem(2px) solid $brand-1;
}
.is-startpoint-2 {
  border: rem(2px) solid $brand-2;
}
.is-startpoint-3 {
  border: rem(2px) solid $brand-3;
}
.is-startpoint-4 {
  border: rem(2px) solid $brand-4;
}

// .is-bench {}
// .is-startpoint {}
// .is-common {}
// .is-endpoint {}
</style>
