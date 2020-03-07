<template>
  <nav class="wrapper h-100" :class="{ 'game-over': playerWinner }">
    <ul class="nav d-flex flex-column justify-content-center align-items-center h-100">
      <li>
        <p v-if="playerWinner" class="message h3 text-dark mb-4">
          <span class="font-weight-bold mr-2">{{ playerWinner.name }}</span>
          <span>Won the Game!</span>
        </p>
      </li>
      <li class="w-75">
        <button
          v-if="gameStatus === GameStatus.NOT_STARTED"
          @click="onClickStart()"
          class="btn btn-lg text-uppercase w-100 btn-primary mb-3 font-weight-bolder rounded-pill shadow-sm"
          type="button"
        >
          Start Game
        </button>
      </li>
      <li class="w-75">
        <button
          v-if="gameStatus === GameStatus.GAME_OVER"
          @click="onClickStart()"
          class="btn btn-lg text-uppercase w-100 btn-primary mb-3 font-weight-bolder rounded-pill shadow-sm"
          type="button"
        >
          Play Again
        </button>
      </li>
      <li class="w-75">
        <button
          v-if="gameStatus === GameStatus.PLAYING"
          @click="onClickPause()"
          class="btn btn-lg text-uppercase w-100 btn-primary mb-3 font-weight-bolder rounded-pill shadow-sm"
          type="button"
        >
          Pause
        </button>
      </li>
      <li class="w-75">
        <button
          v-if="gameStatus === GameStatus.PAUSED"
          @click="onClickResume()"
          class="btn btn-lg text-uppercase w-100 btn-primary mb-3 font-weight-bolder rounded-pill shadow-sm"
          type="button"
        >
          Resume
        </button>
      </li>
      <li class="w-75">
        <button
          @click="onClickQuit()"
          class="btn btn-lg text-uppercase w-100 btn-secondary font-weight-normal rounded-pill shadow-sm"
          type="button"
        >
          Quit
        </button>
      </li>
    </ul>
  </nav>
</template>

<script lang="ts">
import store from '@/store/index.ts';
import { GameStatus, BoardStatus, Player } from '@/types/types.ts';
import { quitGame, pauseGame } from '@/helpers';
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
  name: 'menu-board',
  data() {
    return {
      BoardStatus,
      GameStatus
    };
  },
  computed: {
    playerWinner(): Player {
      return store.getters['board/playerWinner'];
    },
    boardStatus(): BoardStatus {
      return store.getters['board/boardStatus'];
    },
    gameStatus(): GameStatus {
      return store.getters['gameStatus'];
    }
  },
  methods: {
    onClickStart() {
      this.$emit('start_game');
    },
    onClickPause() {
      pauseGame();
    },
    async onClickResume() {
      this.$emit('resume_game');
    },
    onClickQuit() {
      quitGame();
    }
  }
});
</script>

<style lang="scss" scoped>
.wrapper {
  z-index: 1;
  background: rgba($light, 0.5);
  border-radius: $border-radius;
  @include absolute-cover;
  &.game-over {
    background: rgba($light, 0.8);
  }
}
</style>
