<template>
  <nav>
    <ul class="nav">
      <button
        v-if="gameStatus === GameStatus.NOT_STARTED"
        @click="onClickStart()"
        class="btn btn-primary mr-2"
        type="button"
      >Start Game</button>
      <button
        v-if="gameStatus === GameStatus.PLAYING"
        @click="onClickPause()"
        class="btn btn-primary mr-2"
        type="button"
      >Pause</button>
      <button
        v-if="gameStatus === GameStatus.PAUSED"
        @click="onClickResume()"
        class="btn btn-primary mr-2"
        type="button"
      >Resume</button>
      <router-link class="btn btn-secondary" to="/">Quit</router-link>
    </ul>
  </nav>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import store from '@/store/index.ts';
import { GameStatus, BoardStatus } from '@/types/types.ts';

@Component
export default class BoardComponent extends Vue {

  data() {
    return {
      BoardStatus,
      GameStatus
    };
  }

  get boardStatus(): BoardStatus {
    return store.getters["boardStatus"];
  }
  get gameStatus(): GameStatus {
    return store.getters["gameStatus"];
  }

  onClickStart() {    
    this.$emit('start_game');
  }
  onClickPause() {
    this.pauseGame();
  }
  onClickResume() {
    this.resumeGame();
  }

  async pauseGame() {
    await store.dispatch("updateGameStatus", GameStatus.PAUSED);
  }
  async resumeGame() {
    await store.dispatch("updateGameStatus", GameStatus.PLAYING);
  }
}
</script>

<style lang="scss" scoped>
</style>
