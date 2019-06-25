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
  isActive: boolean;
}

export interface MoveAction {
  from: PositionInBoard;
  to: PositionInBoard;
  type: MoveType;
  marble: Marble;
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
  SAFEZONE = 5,
  FINAL = 6
}

export type StepPlace = [Row, Column, Side, StepType[]];

export interface DiceAnalization {
  value: number;
  canMoveBench: boolean;
  hasReward: boolean;
}

export interface Marble {
  id: number;
  row: Row;
  column: Column;
  side: Side;
  isInGame: boolean;
  isAtEnd: boolean;
  isAtFinal: boolean;
  isMoveable: boolean;
  isMoving: boolean;
}

export enum MoveType {
  BENCH = 0,
  IN_GAME = 2
}

export enum GameStatus {
  NOT_STARTED = 0,
  PLAYING = 1,
  PAUSED = 2,
  GAME_OVER = 3
}

export enum BoardStatus {
  INITIALIZING = 0,
  TURNING_DICE = 1,
  MOVING_MARBLES = 2,
  PLAYER_IS_THINKING = 3,
  PAUSED = 4,
  FINISHED = 5,
  WAITING_TURN_DICE = 6
}
