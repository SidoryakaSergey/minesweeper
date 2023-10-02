import {
  isFirstClick,
  setFirstClick,
  startGame,
  newGameHadler,
  toggleTheme,
  matrixGame,
  matrixGameState,
  openedCells,
  placementMines,
  numberMinesAround,
  isWinGame,
  setPlayerName,
  setSetting,
  getSetting,
  delSetting,
  loadSetting,
  renderTable,
  isLoadGame,
  startTimer,
  plusFlagPlayer,
  minusFlagPlayer,
  plusClick,
  toggleSound,
  playSound,
  disableNewGameSetting,
  winTheGame,
  loseTheGame,
  openOtherCeil,
  writeLastList,
  loadLastList,
} from './functions.js';

loadLastList();
writeLastList();

const themeBtn = document.getElementById('theme-btn');

const rangeInput = document.querySelector('#range-input');
const rangeValue = document.querySelector('#range-input-value');

const gameTable = document.querySelector('#game-table');

const newGame = document.querySelector('#new-game');
const continueGame = document.querySelector('#continue-game');
const loadChoice = document.querySelector('#load-choice');
const sound = document.querySelector('.sound');
const newGameBtn = document.querySelector('#start-game');

const gameOver = document.querySelector('#game-over');
const startGameAgain = document.querySelector('#start-game-again');
const startGameMore = document.querySelector('#start-game-more');

newGameBtn.addEventListener('click', newGameHadler);
startGameAgain.addEventListener('click', newGameHadler);
startGameMore.addEventListener('click', newGameHadler);

sound.addEventListener('click', toggleSound);

window.addEventListener('beforeunload', () => {
  if (!isFirstClick()) {
    setSetting();
  }
});

newGame.addEventListener('click', () => {
  loadChoice.style.display = 'none';
  document.body.classList.remove('overflow-hidden');
  delSetting();
  startGame();
});

continueGame.addEventListener('click', () => {
  loadChoice.style.display = 'none';
  document.body.classList.remove('overflow-hidden');
  const obj = getSetting();
  if (obj) {
    disableNewGameSetting(true);
    setPlayerName(obj.userName);
    loadSetting(obj);
    renderTable();
    startTimer();
    setFirstClick(false);
  } else {
    startGame();
  }
});

rangeInput.addEventListener('input', () => {
  rangeValue.textContent = rangeInput.value;
});

themeBtn.addEventListener('click', toggleTheme);

gameTable.addEventListener('click', ({ target }) => {
  if (!target.classList.contains('game-ceil')) {
    return;
  }
  if (target.classList.contains('dog')) {
    return;
  }
  if (target.classList.contains('opened')) {
    return;
  }
  playSound(1);
  plusClick();
  const x = +target.dataset.x;
  const y = +target.dataset.y;

  if (isFirstClick() && !isLoadGame) {
    placementMines(x, y);
    numberMinesAround();
    setFirstClick(false);
    startTimer();
    disableNewGameSetting(true);
  }

  if (matrixGame[x][y] === 'x') {
    openOtherCeil();
    target.classList.add('explosion');
    loseTheGame();
  }

  matrixGameState[x][y] = 'a';
  if (+matrixGame[x][y] === 0) {
    openedCells(x, y);
    if (isWinGame()) {
      winTheGame();
    }
    return;
  }
  target.classList.add('opened');
  target.classList.remove('hover-effect');
  if (matrixGame[x][y] === 'x') {
    target.classList.add('mine');
  } else {
    target.innerText = matrixGame[x][y];
    target.classList.add(`x${matrixGame[x][y]}`);
  }
  if (isWinGame()) {
    winTheGame();
  }
});

gameTable.addEventListener('contextmenu', event => {
  event.preventDefault();
  if (isFirstClick()) {
    return;
  }
  const { target } = event;
  if (!target.classList.contains('game-ceil')) {
    return;
  }
  if (target.classList.contains('opened')) {
    return;
  }
  playSound(2);
  if (target.classList.contains('dog')) {
    minusFlagPlayer();
  } else {
    plusFlagPlayer();
  }
  target.classList.toggle('dog');
  const x = +target.dataset.x;
  const y = +target.dataset.y;
  if (matrixGame[x][y] === 'x') {
    if (target.classList.contains('dog')) {
      matrixGameState[x][y] = 'd';
    } else {
      matrixGameState[x][y] = 'x';
    }
  } else {
    if (target.classList.contains('dog')) {
      matrixGameState[x][y] = 'd';
    } else {
      matrixGameState[x][y] = '0';
    }
  }
});
