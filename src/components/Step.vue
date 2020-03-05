<template>
  <span class="step d-flex justify-content-center align-items-center">
    <span :class="getClasses()" class="inner d-flex"></span>
  </span>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import { StepType } from '@/types/types';

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
    const result = [];

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
  width: $step-width;
  height: $step-width;
}
.inner {
  border-radius: 100%;
  background: lighten($brand-10, 45%);
  box-shadow: 0 0 1px lighten($brand-10, 32%) inset;
  width: 100%;
  height: 100%;
}

// startpoint
.type-2 {
  &::before {
    background: url('../assets/img/arrow.svg') no-repeat center;
    background-size: 60%;
    content: '';
    width: 100%;
    height: 100%;
    @include absolute-cover;
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
  width: rem(100% / $golden-ratio);
  height: rem(100% / $golden-ratio);
  &.side-1 {
    box-shadow: 0 0 rem(2px) $brand-1 inset;
    background-color: rgba($brand-1, 0.4);
  }
  &.side-2 {
    box-shadow: 0 0 rem(2px) $brand-2 inset;
    background-color: rgba($brand-2, 0.4);
  }
  &.side-3 {
    box-shadow: 0 0 rem(2px) $brand-3 inset;
    background-color: rgba($brand-3, 0.4);
  }
  &.side-4 {
    box-shadow: 0 0 rem(2px) $brand-4 inset;
    background-color: rgba($brand-4, 0.4);
  }
}

// final
$star-background-size: 60%;
.type-6 {
  box-shadow: none;
  background: url('../assets/img/star.svg') no-repeat center;
  background-size: $star-background-size;
}

// bench
.type-0 {
  background-size: 0;
  background-repeat: no-repeat;
  background-position: center;
  transition: background-size #{$step-go-to-heaven-duration}ms ease #{$step-go-to-heaven-delay}ms;
}
// bench-done
.type-4 {
  background-size: $star-background-size;
  &.side-1 {
    background-image: url('../assets/img/star-side-1.svg');
  }
  &.side-2 {
    background-image: url('../assets/img/star-side-2.svg');
  }
  &.side-3 {
    background-image: url('../assets/img/star-side-3.svg');
  }
  &.side-4 {
    background-image: url('../assets/img/star-side-4.svg');
  }
}
// .common
</style>
