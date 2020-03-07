<template>
  <div class="marbles">
    <Marble v-on:clickmarble="onClickMarble" :model="item" v-for="item in list" :key="item.id" />
  </div>
</template>

<script lang="ts">
import store from '@/store/index';
import MarbleComponent from '@/components/Marble.vue';
import { Vue, Component } from 'vue-property-decorator';
import { Marble } from '@/types/types';

@Component({
  components: {
    Marble: MarbleComponent
  }
})
export default class MarblesComponent extends Vue {
  get list() {
    return store.getters['marbles/list'];
  }

  onClickMarble(marble: Marble) {
    this.$emit('clickmarble', marble);
  }
}
</script>

<style lang="scss" scoped>
.marbles {
  @include absolute-cover;
}
</style>
