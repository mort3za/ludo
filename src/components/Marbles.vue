<template>
  <div class="marbles">
    <Marble :model="item" v-for="item in items" :key="item.id"/>
  </div>
</template>

<script>
import store from "@/store/index.ts";
import Marble from "@/components/Marble.vue";
export default {
  name: "marbles",
  components: {
    Marble
  },
  computed: {
    items() {
      const list = store.getters["marbles/list"];
      list.map(item => {
        item.player = store.getters["players/itemBySide"](item.side);
      });
      return list;
    }
  }
};
</script>

<style lang="scss" scoped>
.marbles {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}
</style>
