<template>
  <div>
    <div class="road">
      <div>
        <Step
          v-for="step in steps"
          :style="getStepStyle(step)"
          :row="step[StepPlaceProps.ROW]"
          :column="step[StepPlaceProps.COLUMN]"
          :side="step[StepPlaceProps.SIDE]"
          :types="step[StepPlaceProps.STEP_TYPE]"
          :key="`${step[StepPlaceProps.ROW]}-${step[StepPlaceProps.COLUMN]}-${step[StepPlaceProps.SIDE]}`"
          :class="[`step row-${step[StepPlaceProps.ROW]} column-${step[StepPlaceProps.COLUMN]}`]"
        />
      </div>
      <div>
        <p
          v-for="player in players"
          :key="`player-name-${player.id}`"
          :class="[`player-name-${player.side}`, { 'is-active font-weight-bold': isPlayerActive(player) }]"
          class="player-name d-block text-truncate text-center mb-2"
        >
          {{ player.name }}
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import store from '@/store/index';
import Step from '@/components/Step.vue';
import { StepPlace, Player, StepPlaceProps } from '@/types/types';
import { STEP_WIDTH, STEP_GUTTER } from '@/constants.ts';

export default {
  name: 'road',
  components: {
    Step
  },
  data() {
    return {
      StepPlaceProps
    };
  },
  computed: {
    playerActive(): Player {
      return store.getters['board/playerActive'];
    },
    steps(): StepPlace[] {
      return store.getters['steps/allSteps'];
    },
    players(): Player[] {
      return store.getters['players/list'];
    }
  },
  methods: {
    getStepStyle(step: StepPlace) {
      const row = step[StepPlaceProps.ROW];
      const column = step[StepPlaceProps.COLUMN];

      return {
        top: `${(row - 1) * (STEP_WIDTH + STEP_GUTTER) + '%'}`,
        left: `${(column - 1) * (STEP_WIDTH + STEP_GUTTER) + '%'}`
      };
    },

    isPlayerActive(player: Player): boolean {
      if (!this.playerActive) {
        return false;
      }
      return this.playerActive.id === player.id;
    }
  }
};
</script>

<style lang="scss" scoped>
.road {
  margin: auto;
}
.step {
  position: absolute;
}
.player-name {
  position: absolute;
  margin-bottom: 0;
  font-size: $font-size-sm;
  width: $step-width * 2 + $step-gutter;
  border-radius: $border-radius;
  &.is-active {
    transition: background-color 200ms linear;
    background-color: $secondary;
  }
}
.player-name-1 {
  bottom: 2 * ($step-width + $step-gutter);
  left: 0;
  margin-bottom: rem(16px);
}
.player-name-2 {
  top: 2 * ($step-width + $step-gutter);
  margin-top: rem(16px);
  left: 0;
}
.player-name-3 {
  top: 2 * ($step-width + $step-gutter);
  margin-top: rem(16px);
  right: 0;
  text-align: right;
}
.player-name-4 {
  bottom: 2 * ($step-width + $step-gutter);
  right: 0;
  margin-bottom: rem(16px);
  text-align: right;
}
</style>
