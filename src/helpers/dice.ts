import { DiceInfo, BoardStatus, Player } from '@/types/types';
// @ts-ignore
import MersenneTwister from 'mersenne-twister';
import store from '@/store/index.ts';
import { saveGame } from '@/helpers';

export function createDiceInfo({ value, isDone = false, player }: DiceInfo): DiceInfo {
  const isSix = value === 6;

  return {
    value,
    canMoveBench: isSix,
    hasReward: isSix,
    isDone,
    player
  };
}

export function getRandom() {
  const generator = new MersenneTwister();
  const result = generator.random();
  // console.log("random:", result);
  return result;
}

export function setDiceAsDone() {
  const diceInfo: DiceInfo = store.getters['board/diceInfo'];
  const updatedDiceInfo = { ...diceInfo, isDone: true };
  store.dispatch('board/update', { key: 'diceInfo', value: updatedDiceInfo });
}

export async function turnDice(activePlayer: Player) {
  store.dispatch('board/update', {
    key: 'boardStatus',
    value: BoardStatus.TURNING_DICE
  });
  const result = Math.ceil(getRandom() * 6);
  await store.dispatch('board/update', {
    key: 'diceInfo',
    value: createDiceInfo({
      // @ts-ignore FIXME: remove
      // value: window.dice || result,
      value: result,
      isDone: false,
      player: activePlayer
    })
  });
  store.dispatch('board/update', {
    key: 'boardStatus',
    value: BoardStatus.PLAYER_IS_THINKING
  });
  saveGame('turned dice');
  // console.log("dice:", result, "player:", this.activePlayer.id);
}
