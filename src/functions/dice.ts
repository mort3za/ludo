export function analyzeResult(diceResult: number) {
  const isSix = diceResult === 6;
  return {
    canMoveBench: isSix,
    hasReward: isSix
  };
}
