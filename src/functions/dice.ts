import { DiceAnalization } from "@/types/types";

export function analyzeResult(diceResult: number): DiceAnalization {
  const isSix = diceResult === 6;

  return {
    value: diceResult,
    canMoveBench: isSix,
    hasReward: isSix
  };
}
