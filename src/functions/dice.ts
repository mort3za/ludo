export function analyzeResult(diceResult: number): DiceAnalization {
  const isSix = diceResult === 6;
  return {
    canMoveBench: isSix,
    hasReward: isSix
  };
}
