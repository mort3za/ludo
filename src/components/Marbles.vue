<template>
  <div class="marbles">
    <Marble :model="item" v-for="item in list" :key="item.id"/>
  </div>
</template>

<script lang="ts">
import store from "@/store/index";
import MarbleComponent from "@/components/Marble.vue";
import { Vue, Component } from "vue-property-decorator";
import { Marble } from '../types/types';

@Component({
  components: {
    Marble: MarbleComponent
  }
})
export default class MarblesComponent extends Vue {
  get list() {
    const list = store.getters["marbles/list"];
    list.map((marble: Marble) => {
      marble.player = store.getters["players/itemBySide"](marble.side);
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
