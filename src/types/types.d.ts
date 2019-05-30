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
