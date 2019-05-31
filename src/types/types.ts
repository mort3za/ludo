export interface PositionInBoard {
  row: number;
  column: number;
}

export interface Player {
  id: number;
  side: number;
  color: string;
  name: string;
  isInGame: boolean;
  isAI: boolean;
}

export interface MoveAction {
  from: PositionInBoard;
  to: PositionInBoard;
}

type Row = number;
type Column = number;
type Side = number;
export enum StepType {
  BENCH = 0,
  COMMON = 1,
  ENDPOINT = 2,
  STARTPOINT = 3,
  SAFEZONE = 4
}

export type StepPlace = [Row, Column, Side, StepType[]];

export interface DiceAnalization {
  canMoveBench: boolean;
  hasReward: boolean;
}

type MarbleId = number;

export interface Marble {
  id: MarbleId;
  row: Row;
  column: Column;
  side: Side;
  isInGame: boolean;
  isAtEnd: boolean;
}
