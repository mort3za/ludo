<template>
  <span :class="`is-side-${model.side}`" class="marble d-block" :style="getStyle()"></span>
</template>

<script>
export default {
  name: "marble",
  props: {
    model: {
      type: Object,
      required: true
    }
  },
  computed: {
    isAtEnd() {
      // TODO:
    },
    isInGame() {
      // TODO:
    }
  },
  methods: {
    moveToPosition({ row, column }) {
      // TODO:
    },
    goToGame() {
      // TODO:
    },
    goOutOfGame() {
      // TODO:
    },
    getStyle() {
      return {
        transform: `
        translateX(${(this.model.column - 1) * 44 + "px"})
        translateY(${(this.model.row - 1) * 44 + "px"})
        `
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.marble {
  width: rem(40px);
  height: rem(40px);
  border-radius: 100%;
  box-shadow: rem(2px 2px 2px) $gray-60;
  background: $light url("../assets/img/flower.svg") no-repeat center;
  background-size: rem(32px);
  position: absolute;
  transition: transform 1s ease;
}
.is-side-1 {
  background-color: $brand-1;
}
.is-side-2 {
  background-color: $brand-2;
}
.is-side-3 {
  background-color: $brand-3;
}
.is-side-4 {
  background-color: $brand-4;
}
</style>
