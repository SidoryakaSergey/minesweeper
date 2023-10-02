const bodyHTML = ``;
let firstClick = true;
let matrixGame = [];
let matrixGameState = [];
let sizeMatrix = 10;
let minesCount = 10;
let secondsPlayer = 0;
let clicksPlayer = 0;
let flagsPlayer = 0;
let timerId;
const SIZE_15 = '15';
const SIZE_25 = '25';
const keyLocalS = 'PatronMinesweeper';
const keyLocalLastList = 'PatronLastList';
let lastList = new ListLastSorrers(10);
let isLoadGame = false;
let soundPlay = true;
let audio = new Audio();

function isFirstClick() {
  return firstClick;
}

function setFirstClick(bool) {
  firstClick = bool;
}

function plusClick() {
  const countClicks = document.getElementById('clicks');
  clicksPlayer++;
  countClicks.textContent = clicksPlayer;
}

function plusFlagPlayer() {
  const countFlags = document.getElementById('mines');
  flagsPlayer++;
  countFlags.textContent = `${flagsPlayer}/${minesCount}`;
}

function minusFlagPlayer() {
  const countFlags = document.getElementById('mines');
  flagsPlayer--;
  countFlags.textContent = `${flagsPlayer}/${minesCount}`;
}

function updateTimer() {
  const timeElement = document.getElementById('time');
  secondsPlayer++;
  timeElement.textContent = secondsPlayer;
}

function startTimer() {
  stopTimer();
  timerId = setInterval(updateTimer, 1000);
}

function stopTimer() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
}

function getPlayerName() {
  const playerName = document.querySelector('.player-name');
  return playerName.value;
}
function setPlayerName(name) {
  const playerName = document.querySelector('.player-name');
  playerName.value = name;
}

function getSetting() {
  const data = localStorage.getItem(keyLocalS);
  if (data) {
    return JSON.parse(data);
  } else {
    return false;
  }
}

function delSetting() {
  localStorage.removeItem(keyLocalS);
}

function setSetting() {
  const obj = {};
  obj.userName = getPlayerName();
  obj.sizeMatrix = sizeMatrix;
  obj.minesCount = minesCount;
  obj.matrixGame = matrixGame;
  obj.matrixGameState = matrixGameState;
  obj.secondsPlayer = secondsPlayer;
  obj.clicksPlayer = clicksPlayer;
  obj.flagsPlayer = flagsPlayer;

  const jsonData = JSON.stringify(obj);
  localStorage.setItem(keyLocalS, jsonData);
}

function loadSetting(obj) {
  matrixGame = obj.matrixGame;
  matrixGameState = obj.matrixGameState;
  minesCount = obj.minesCount;
  sizeMatrix = obj.sizeMatrix;
  secondsPlayer = obj.secondsPlayer;
  clicksPlayer = obj.clicksPlayer;
  flagsPlayer = obj.flagsPlayer;

  isLoadGame = true;
}

function renderTable() {
  const sizeTable = document.getElementById('size-table');
  const gameTable = document.getElementById('game-table');
  const rangeInput = document.querySelector('#range-input');
  const rangeValue = document.querySelector('#range-input-value');
  const countClicks = document.getElementById('clicks');
  const countFlags = document.getElementById('mines');
  const timeElement = document.getElementById('time');

  createGameTable();

  countClicks.textContent = clicksPlayer;
  countFlags.textContent = `${flagsPlayer}/${minesCount}`;

  for (let x = 0; x < sizeMatrix; x++) {
    for (let y = 0; y < sizeMatrix; y++) {
      const ceil = document.querySelector(`[data-x="${x}"][data-y="${y}"]`);
      switch (matrixGameState[x][y]) {
        case 'a':
          if (+matrixGame[x][y] > 0) {
            ceil.innerText = matrixGame[x][y];
            ceil.classList.add(`x${matrixGame[x][y]}`);
          }
          ceil.classList.add('opened');
          ceil.classList.remove('hover-effect');
          break;
        case 'd':
          ceil.classList.add('dog');
          break;
      }
    }
  }
}

function startGame() {
  const sizeTable = document.getElementById('size-table');
  const rangeInput = document.querySelector('#range-input');
  const rangeValue = document.querySelector('#range-input-value');

  sizeMatrix = sizeTable.value;
  minesCount = getMinesCount();
  matrixGame = createEmptyMatrix();

  createGameTable();

  rangeInput.addEventListener('change', () => {
    minesCount = rangeInput.value;
  });

  sizeTable.addEventListener('change', ({ target }) => {
    sizeMatrix = target.value;
    minesCount = getMinesCount();
    matrixGame = createEmptyMatrix();
    createGameTable();
  });

  function createEmptyMatrix() {
    const size = parseInt(sizeMatrix);
    const array = Array.from(Array(size), () => new Array(size).fill(0));
    return array;
  }

  function getMinesCount() {
    switch (sizeMatrix) {
      case '10':
        rangeInput.value = 10;
        rangeValue.textContent = rangeInput.value;
        return rangeInput.value;
      case '15':
        rangeInput.value = 40;
        rangeValue.textContent = rangeInput.value;
        return rangeInput.value;
      case '25':
        rangeInput.value = 99;
        rangeValue.textContent = rangeInput.value;
        return rangeInput.value;
    }
  }
} // start

function newGameHadler() {
  const gameOver = document.querySelector('#game-over');
  const gameWin = document.querySelector('#game-win');
  document.body.classList.remove('overflow-hidden');
  gameOver.style.display = 'none';
  gameWin.style.display = 'none';
  isLoadGame = false;
  delSetting();
  disableNewGameSetting(false);
  setFirstClick(true);
  stopTimer();
  clearStats();
  playSound(5);
  startGame();
}

function clearStats() {
  const countClicks = document.getElementById('clicks');
  const countFlags = document.getElementById('mines');
  const timeElement = document.getElementById('time');
  clicksPlayer = 0;
  flagsPlayer = 0;
  secondsPlayer = 0;
  countClicks.textContent = 0;
  countFlags.textContent = 0;
  timeElement.textContent = 0;
}

function disableNewGameSetting(bool) {
  const sizeTable = document.getElementById('size-table');
  const rangeInput = document.querySelector('#range-input');
  const playerName = document.querySelector('.player-name');
  sizeTable.disabled = bool;
  rangeInput.disabled = bool;
  playerName.disabled = bool;
}

function createGameTable() {
  const gameTable = document.getElementById('game-table');
  gameTable.innerHTML = '';
  for (let i = 0; i < matrixGame.length; i++) {
    let row = document.createElement('div');
    row.className = 'game-row';
    row.dataset.row = i;
    for (let j = 0; j < matrixGame[i].length; j++) {
      const ceil = document.createElement('div');
      ceil.className = 'game-ceil hover-effect';

      if (sizeMatrix === SIZE_15) {
        ceil.classList.add('ceil-15');
      }
      if (sizeMatrix === SIZE_25) {
        ceil.classList.add('ceil-25');
      }
      ceil.dataset.x = i;
      ceil.dataset.y = j;
      row.append(ceil);
    }
    gameTable.append(row);
  }
}

function toggleTheme() {
  const themeStyle = document.getElementById('theme-style');
  const themeBtn = document.getElementById('theme-btn');
  let newTheme = '';
  if (themeStyle.getAttribute('href') === './css/light-theme.css') {
    newTheme = './css/dark-theme.css';
  } else {
    newTheme = './css/light-theme.css';
  }
  themeStyle.setAttribute('href', newTheme);
}

function placementMines(firstX, firstY) {
  let noneXY = [];
  for (let i = firstX - 1; i < firstX + 2; i++) {
    for (let j = firstY - 1; j < firstY + 2; j++) {
      noneXY.push([i, j]);
    }
  }
  for (let i = 0; i < minesCount; i++) {
    let { x, y } = randomXY();
    matrixGame[x][y] = 'x';
  }
  console.log('Массив для проверяющих', matrixGame);
  matrixGameState = matrixGame.map(el => [...el]);

  function randomXY() {
    let x = 0,
      y = 0;
    do {
      x = Math.trunc(Math.random() * sizeMatrix);
      y = Math.trunc(Math.random() * sizeMatrix);
    } while (matrixGame[x][y] || noneXY.some(el => el[0] === x && el[1] === y));
    return { x, y };
  }
}

function numberMinesAround() {
  for (let x = 0; x < matrixGame.length; x++) {
    for (let y = 0; y < matrixGame[x].length; y++) {
      if (matrixGame[x][y] !== 'x') {
        matrixGame[x][y] = countAroundMines(x, y);
      }
    }
  }

  function countAroundMines(x, y) {
    let countMines = 0;
    for (let i = x - 1; i < x + 2; i++) {
      for (let j = y - 1; j < y + 2; j++) {
        if (i >= 0 && j >= 0 && i < sizeMatrix && j < sizeMatrix) {
          if (matrixGame[i][j] === 'x') {
            countMines++;
          }
        }
      }
    }
    return countMines;
  }
}

function openedCells(x, y) {
  if (matrixGame[x][y] === 'x') {
    return;
  }
  const element = document.querySelector(`[data-x="${x}"][data-y="${y}"]`);
  if (element.classList.contains('opened')) {
    return;
  }
  if (element.classList.contains('dog')) {
    return;
  }
  element.classList.add('opened');
  element.classList.remove('hover-effect');
  matrixGameState[x][y] = 'a';
  if (+matrixGame[x][y] > 0) {
    element.innerText = matrixGame[x][y];
    element.classList.add(`x${matrixGame[x][y]}`);
  } else {
    for (let i = x - 1; i < x + 2; i++) {
      for (let j = y - 1; j < y + 2; j++) {
        if (
          i >= 0 &&
          j >= 0 &&
          i < sizeMatrix &&
          j < sizeMatrix &&
          matrixGame[i][j] !== 'x'
        ) {
          openedCells(i, j);
        }
      }
    }
  }
  return;
}

function isWinGame() {
  const flatMatrix = matrixGameState.flat();
  return !flatMatrix.includes(0);
}

function toggleSound() {
  const sound = document.querySelector('.sound');
  sound.classList.toggle('sound-off');

  if (soundPlay) {
    stopAudio();
  }
  soundPlay = !soundPlay;
}

function stopAudio() {
  audio.pause();
}

function playSound(numberSound) {
  if (!soundPlay) {
    return;
  }

  switch (numberSound) {
    case 1:
      audio.preload = 'auto';
      audio.src = 'assets/audio/drip.mp3';
      audio.play();
      break;
    case 2:
      audio.preload = 'auto';
      audio.src = 'assets/audio/gav-gav.mp3';
      audio.play();
      break;
    case 3:
      audio.preload = 'auto';
      audio.src = 'assets/audio/bom-bom.mp3';
      audio.play();
      break;
    case 4:
      audio.preload = 'auto';
      audio.src = 'assets/audio/win.mp3';
      audio.play();
      break;
    case 5:
      audio.preload = 'auto';
      audio.src = 'assets/audio/restart.mp3';
      audio.play();
      break;
  }
}

function loseTheGame() {
  const gameOver = document.querySelector('#game-over');
  playSound(3);
  gameOver.style.display = 'flex';
  document.body.classList.add('overflow-hidden');
}

function winTheGame() {
  const gameWinModal = document.querySelector('#game-win');
  const winName = document.querySelector('#win-name');
  const winnerTime = document.querySelector('.winner-time');
  winName.textContent = getPlayerName();
  const min =
    Math.trunc(secondsPlayer / 60) > 9
      ? `${Math.trunc(secondsPlayer / 60)}`
      : `0${Math.trunc(secondsPlayer / 60)}`;
  const sec =
    secondsPlayer % 60 > 9 ? `${secondsPlayer % 60}` : `0${secondsPlayer % 60}`;
  winnerTime.textContent = `${min}:${sec}`;
  lastList.add(`${winName.textContent} ${min}:${sec}`);
  writeLastList();
  saveLastList();
  playSound(4);
  gameWinModal.style.display = 'flex';
  document.body.classList.add('overflow-hidden');
}

function ListLastSorrers(maxSize) {
  let arr = [];
  this.add = function (value) {
    arr.push(value);
    if (arr.length > maxSize) {
      arr.shift();
    }
  };
  this.load = function (mas) {
    arr = [];
    for (let el of mas) {
      arr.push(el);
    }
  };
  this.getAll = function () {
    return arr;
  };
}

function saveLastList() {
  const obj = {};
  obj.lastList = lastList.getAll();
  const jsonData = JSON.stringify(obj);
  localStorage.setItem(keyLocalLastList, jsonData);
}

function loadLastList() {
  const data = localStorage.getItem(keyLocalLastList);
  if (data) {
    const obj = JSON.parse(data);
    lastList.load(obj.lastList);
  }
}

function writeLastList() {
  const lastListOL = document.querySelector('.last-list');
  if (lastList.getAll().length > 0) {
    lastListOL.innerHTML = '';
    lastList.getAll().forEach(el => {
      const li = document.createElement('li');
      li.classList.add('last-item');
      li.innerText = el;
      lastListOL.append(li);
    });
  }
}

function openOtherCeil() {
  const allCeil = document.querySelectorAll('.game-ceil');
  allCeil.forEach(el => {
    const x = +el.dataset.x;
    const y = +el.dataset.y;
    if (matrixGame[x][y] === 'x') {
      el.classList.add('mine');
      el.classList.add('opened');
    }
    if (matrixGame[x][y] > 0) {
      el.classList.add('opened');
      el.innerText = matrixGame[x][y];
      el.classList.add(`x${matrixGame[x][y]}`);
    }
    if (el.classList.contains('dog')) {
      if (matrixGame[x][y] !== 'x') {
        el.classList.add('explosion');
        el.classList.add('dog');
        el.innerText = '';
      }
    }
  });
}

export {
  isFirstClick,
  setFirstClick,
  startGame,
  newGameHadler,
  matrixGame,
  matrixGameState,
  toggleTheme,
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
};
