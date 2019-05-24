<template>
  <span class="d-flex step justify-content-center align-content-center font-size-sm"></span>
</template>

<script>
export default {
  name: "step",
  props: {
    row: {
      type: Number,
      required: true
    },
    column: {
      type: Number,
      required: true
    },
    type: {
      type: String,
      required: true
    }
  }
};
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

// .is-endpoint {}
// .is-normal {}
</style>
