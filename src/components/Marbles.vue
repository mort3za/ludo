<template>
  <div class="marbles">
    <Marble :model="item" v-for="item in items" :key="item.id"/>
  </div>
</template>

<script>
import store from "@/store/index";
import Marble from "@/components/Marble.vue";
import { Vue, Component } from "vue-property-decorator";

@Component({
  components: {
    Marble
  }
})
export default class Marbles extends Vue {
  get items() {
    const list = store.getters["marbles/list"];
    list.map(item => {
      item.player = store.getters["players/itemBySide"](item.side);
    });
    return list;
  }
}
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
