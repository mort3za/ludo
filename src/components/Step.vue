<template>
  <span
    :class="getClasses()"
    class="d-flex step justify-content-center align-content-center font-size-sm"
  ></span>
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

  @Prop({ type: Number, required: true })
  public side!: number;

  @Prop({ type: Array as () => StepType[], required: true })
  public types!: StepType[];

  getClasses() {
    let result = [];

    this.types.forEach(type => {
      result.push(`type-${type}`);
    });
    result.push(`side-${this.side}`);
    return result;
  }
}
</script>

<style lang="scss" scoped>
.step {
  width: rem($step-width);
  height: rem($step-width);
  border-radius: 100%;
  background: $gray-96;
  box-shadow: 0 0 rem(2px) $dark inset;
}

// startpoint
.type-2 {
  position: relative;
  &::before {
    background: url("../assets/img/arrow.svg") no-repeat center;
    background-size: rem(0.6 * $step-width);
    content: "";
    width: rem($step-width);
    height: rem($step-width);
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  &.side-1 {
    &::before {
      transform: rotate(180deg);
    }
  }
  &.side-2 {
    &::before {
      transform: rotate(270deg);
    }
  }
  &.side-3 {
    &::before {
      transform: rotate(0);
    }
  }
  &.side-4 {
    &::before {
      transform: rotate(90deg);
    }
  }
}

// endpoint
.type-3 {
  width: rem($step-width / $golden-ratio);
  height: rem($step-width / $golden-ratio);
  &.side-1 {
    box-shadow: 0 0 rem(2px) $brand-1 inset;
    background-color: rgba($brand-1, 0.16);
  }
  &.side-2 {
    box-shadow: 0 0 rem(2px) $brand-2 inset;
    background-color: rgba($brand-2, 0.16);
  }
  &.side-3 {
    box-shadow: 0 0 rem(2px) $brand-3 inset;
    background-color: rgba($brand-3, 0.16);
  }
  &.side-4 {
    box-shadow: 0 0 rem(2px) $brand-4 inset;
    background-color: rgba($brand-4, 0.16);
  }
}

// final
.type-6 {
  box-shadow: none;
  background: url("../assets/img/star.svg") no-repeat center;
  background-size: rem(24px);
}
// .common
// .bench
</style>
