import { DiceAnalization } from "@/types/types";
// @ts-ignore
import MersenneTwister from "mersenne-twister";

export function analyzeResult(diceResult: number): DiceAnalization {
  const isSix = diceResult === 6;

  return {
    value: diceResult,
    canMoveBench: isSix,
    hasReward: isSix
  };
}

export function getRandom() {
  const generator = new MersenneTwister();
  const result = generator.random();
  // console.log("random:", result);
  return result;
}
