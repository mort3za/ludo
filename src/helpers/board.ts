import store from '@/store/index.ts';
import { BoardStatus, GameStatus, Player } from '@/types/types';
import { getRandom, wait } from '.';
import router from '@/router';
import { STORAGE_KEY, SLEEP_BEFORE_START_GAME } from '@/constants';

export function finishGame() {
  store.dispatch('board/update', {
    key: 'boardStatus',
    value: BoardStatus.FINISHED
  });
  store.dispatch('updateGameStatus', GameStatus.GAME_OVER);
  const activePlayer = store.getters['board/playerActive'];
  _setWinnerPlayer(activePlayer);
  setShowMenu(true);
  saveGame('game finished');
}

export function setShowMenu(shouldShowMenu: boolean): void {
  store.dispatch('board/update', {
    key: 'shouldShowMenu',
    value: shouldShowMenu
  });
}

export async function startGame() {
  await resetGame();
  await addPlayers();

  await store.dispatch('updateGameStatus', GameStatus.PLAYING);
  setShowMenu(false);
  await wait(SLEEP_BEFORE_START_GAME);
}

function _getRandomPlayer(): Player {
  const allPlayers = store.getters['players/list'];
  const random = Math.ceil(getRandom() * allPlayers.length);
  return allPlayers[random - 1];
}

export async function pauseGame() {
  await store.dispatch('updateGameStatus', GameStatus.PAUSED);
}

export function saveGame(reason: string) {
  store.dispatch('saveGame');
}
export async function quitGame() {
  await store.dispatch('updateGameStatus', GameStatus.NOT_STARTED);
  cleanupBoard();
  sessionStorage.removeItem(STORAGE_KEY);
  router.push({ name: 'home' });
}

export async function cleanupBoard() {
  await store.dispatch('marbles/remove');
  await store.dispatch('players/remove');
  await store.dispatch('board/reset');
}
export async function resetGame() {
  await store.dispatch('marbles/reset');
  await store.dispatch('players/remove');
  await store.dispatch('board/reset');
}
export async function addPlayers() {
  await store.dispatch('players/add', {
    isAI: false,
    isMain: true,
    name: 'You',
    color: 'red',
    isInGame: true
  });
  await store.dispatch('players/add', {
    isAI: true,
    isMain: false,
    color: 'green',
    isInGame: true
  });
  await store.dispatch('players/add', {
    isAI: true,
    isMain: false,
    color: 'blue',
    isInGame: true
  });
  await store.dispatch('players/add', {
    isAI: true,
    isMain: false,
    // TODO: change to purple
    color: 'yellow',
    isInGame: true
  });
}

export async function changeTurn() {
  const playerActive = store.getters['board/playerActive'];
  if (!playerActive) {
    return _setPlayerActive(_getRandomPlayer());
  }

  const currentPlayerActiveIndex = store.getters['players/indexInListById'](playerActive.id);

  const allPlayers = store.getters['players/list'];
  const newPlayerActiveIndex = (currentPlayerActiveIndex + 1) % allPlayers.length;
  const newPlayerActive = allPlayers[newPlayerActiveIndex];

  await _setPlayerActive(newPlayerActive);
}

async function _setPlayerActive(player: Player | null) {
  return store.dispatch('board/update', { key: 'playerActive', value: player });
}
async function _setWinnerPlayer(player: Player | null) {
  return store.dispatch('board/update', { key: 'playerWinner', value: player });
}

export function boardWidthUpdater({ boardElement }: { boardElement: HTMLDivElement }) {
  store.dispatch('board/update', {
    key: 'boardWidth',
    value: boardElement.clientWidth
  });
}
