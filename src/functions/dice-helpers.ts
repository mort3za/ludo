import { DiceInfo } from "@/types/types";
// @ts-ignore
import MersenneTwister from "mersenne-twister";
import store from "@/store/index.ts";

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
  const diceInfo: DiceInfo = store.getters["board/diceInfo"];
  const updatedDiceInfo = { ...diceInfo, isDone: true };
  store.dispatch("board/update", { key: "diceInfo", value: updatedDiceInfo });
}
