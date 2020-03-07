<template>
  <div class="marbles">
    <Marble v-on:clickmarble="onClickMarble" :model="item" v-for="item in list" :key="item.id" />
  </div>
</template>

<script lang="ts">
import store from '@/store/index';
import MarbleComponent from '@/components/Marble.vue';
import { Marble } from '@/types/types';
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'marbles',
  components: {
    Marble: MarbleComponent
  },
  computed: {
    list() {
      return store.getters['marbles/list'];
    }
  },
  methods: {
    onClickMarble(marble: Marble) {
      this.$emit('clickmarble', marble);
    }
  }
});
</script>

<style lang="scss" scoped>
.marbles {
  @include absolute-cover;
}
</style>
