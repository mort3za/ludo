<template>
  <div class="page-home">
    <Board />
  </div>
</template>

<script>
import Board from '@/components/Board.vue';
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  components: { Board }
});
</script>
