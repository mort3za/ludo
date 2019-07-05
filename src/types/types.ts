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
  distanceToFinal?: number;
  kickoutList?: Marble[];
  isCurrentPositionSafepoint?: boolean;
  isTargetPositionSafepoint?: boolean;
  quality?: number;
}

type Row = number; // between 0 and 10
type Column = number; // between 0 and 10
type Side = number; // between 1 and 4
// NOTE: these values are hard-coded in Step.vue scss section
export enum StepType {
  BENCH = 0,
  COMMON = 1,
  STARTPOINT = 2,
  ENDPOINT = 3,
  BENCH_DONE = 4,
  SAFEZONE = 5,
  FINAL = 6
}

export type StepPlace = [Row, Column, Side, StepType[]];
export enum StepPlaceProps {
  ROW = 0,
  COLUMN = 1,
  SIDE = 2,
  STEP_TYPE = 3
}

export interface DiceInfo {
  value: number;
  canMoveBench?: boolean;
  hasReward?: boolean;
  isDone: boolean;
  player: Player;
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
