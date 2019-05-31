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
  type: MoveType
}

type Row = number; // between 0 and 10
type Column = number; // between 0 and 10
type Side = number; // between 1 and 4
export enum StepType {
  BENCH = 0,
  COMMON = 1,
  STARTPOINT = 2,
  ENDPOINT = 3,
  LASTPOINT = 4,
  SAFEZONE = 5
}

export type StepPlace = [Row, Column, Side, StepType[]];

export interface DiceAnalization {
  value: number;
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

export enum MoveType {
  BENCH = 0,
  IN_GAME = 2
}
