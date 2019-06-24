<template>
  <nav class="wrapper h-100">
    <ul class="nav d-flex flex-column justify-content-center align-items-center h-100">
      <button
        v-if="gameStatus === GameStatus.NOT_STARTED"
        @click="onClickStart()"
        class="btn w-75 btn-primary mb-3"
        type="button"
      >Start Game</button>
      <button
        v-if="gameStatus === GameStatus.PLAYING"
        @click="onClickPause()"
        class="btn w-75 btn-primary mb-3"
        type="button"
      >Pause</button>
      <button
        v-if="gameStatus === GameStatus.PAUSED"
        @click="onClickResume()"
        class="btn w-75 btn-primary mb-3"
        type="button"
      >Resume</button>
      <button
        @click="onClickQuit()"
        class="btn w-75 btn-secondary"
        type="button"
      >Quit</button>
    </ul>
  </nav>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import store from "@/store/index.ts";
import { GameStatus, BoardStatus } from "@/types/types.ts";

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
    this.$emit("start_game");
  }
  onClickPause() {
    this.pauseGame();
  }
  onClickResume() {
    this.resumeGame();
  }
  onClickQuit() {
    this.quitGame();
  }

  async pauseGame() {
    await store.dispatch("updateGameStatus", GameStatus.PAUSED);
  }
  async resumeGame() {
    await store.dispatch("updateGameStatus", GameStatus.PLAYING);
    this.$emit("resume_game");
  }
  async quitGame() {
    await store.dispatch("updateGameStatus", GameStatus.NOT_STARTED);
    this.$emit("quit_game");
  }
}
</script>

<style lang="scss" scoped>
.wrapper {
  z-index: 1;
  background: rgba($dark, 0.6);
  border-radius: $border-radius;
  @include absolute-cover;
}
</style>
