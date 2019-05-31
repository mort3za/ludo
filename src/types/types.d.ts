interface PositionInBoard {
  row: number;
  column: number;
}

interface Player {
  id: number;
  side: number;
  color: string;
  name: string;
  isInGame: boolean;
  isAI: boolean;
}

interface MoveAction {
  from: PositionInBoard;
  to: PositionInBoard;
}

type Row = number;
type Column = number;
type Side = number;
type StepType = number;

type StepPlace = [Row, Column, Side, StepType];

// interface StepPlace {
//   readonly 0: number;
//   // [row: number, column: number, side: number, type: StepType]
// }

interface DiceAnalization {
  canMoveBench: boolean;
  hasReward: boolean;
}
