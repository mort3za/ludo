<template>
  <div class="marbles">
    <Marble v-on:clickmarble="onClickMarble" :model="item" v-for="item in list" :key="item.id"/>
  </div>
</template>

<script lang="ts">
import store from "@/store/index";
import MarbleComponent from "@/components/Marble.vue";
import { Vue, Component } from "vue-property-decorator";
import { Marble } from "../types/types";
import { getPositionOfMarble, isSameStep } from "../helpers";

@Component({
  components: {
    Marble: MarbleComponent
  }
})
export default class MarblesComponent extends Vue {
  get list() {
    let list = store.getters["marbles/list"];
    list = this.removeSamePlaceMarbles(list);
    return list;
  }

  removeSamePlaceMarbles(list: Marble[]) {
    const upgradedList = list.map((m1: Marble) => {
      let count = 1;
      if (!m1.isInGame) {
        return m1;
      }
      list.forEach((m2: Marble) => {
        const isSameMarble = m1.id === m2.id;
        if (isSameMarble) {
          return;
        }

        const isAtSamePlace = isSameStep(
          getPositionOfMarble(m1),
          getPositionOfMarble(m2)
        );

        if (isAtSamePlace) {
          if (m1.countOnPlace) {
            count++;
          }
        }
        return;
      });
      m1.countOnPlace = count;
      return m1;
    });

    return upgradedList;
  }

  onClickMarble(marble: Marble) {
    this.$emit("clickmarble", marble);
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
