const height = 50;
const width = 40;
const board = document.querySelector(".board");
board.style.gridTemplateColumns = `repeat(${width},1fr)`;
const snake = [6, 5, 4, 3, 2, 1, 0];
let head = snake[0];
let interval;
let direction = "left";
let isGameOver = false;
let random;
let points = 0;
const audio = document.createElement("audio");
let scoreNum = document.getElementById("score-num");
scoreNum.innerHTML = points;
const rightBorder = [];
const leftBorder = [];
let startGame = document.getElementById("startGame");

function createBoard() {
  for (let i = 0; i < width * height; i++) {
    let div = document.createElement("div");
    board.appendChild(div);
  }
  color();
  setRandom();
}

function color() {
  const divs = board.querySelectorAll("div");
  divs.forEach((el) =>
    el.classList.remove("snake", "head", "up", "right", "down", "left")
  );
  snake.forEach((num) => divs[num].classList.add("snake"));
  divs[head].classList.add("head", direction);
}

for (let i = 1; i <= height; i++) {
  leftBorder.push(i * width);
}
for (let i = 0; i < height; i++) {
  rightBorder.push(i * width - 1);
}

function move(dir) {
  if (isGameOver) {
    return;
  }
  const divs = board.querySelectorAll("div");
  if (dir === "up") {
    if (direction === "down") {
      return;
    }
    head -= width;

    if (!divs[head]) {
      gameOver();
      return;
    }
  } else if (dir === "right") {
    if (direction === "left") {
      return;
    }
    head--;
    if (rightBorder.includes(head)) {
      gameOver();
      return;
    }
  } else if (dir === "down") {
    if (direction === "up") {
      return;
    }
    head += width;
    if (!divs[head]) {
      gameOver();
      return;
    }
  } else if (dir === "left") {
    if (direction === "right") {
      return;
    }
    head++;
    if (leftBorder.includes(head)) {
      gameOver();
      return;
    }
  }
  if (snake.includes(head)) {
    gameOver();
    return;
  }

  direction = dir;
  snake.unshift(head);
  if (random == head) {
    audio.src = "./sound/Pebble.ogg";
    audio.play();
    setRandom();
    points += 10;
    scoreNum.innerHTML = points;
    setHighScore();
  } else {
    snake.pop();
  }

  color();
  startAuto();
}

function startAuto() {
  clearInterval(interval);
  interval = setInterval(() => move(direction), 200);
  if (scoreNum.innerHTML > 100) {
    clearInterval(interval);
    interval = setInterval(() => move(direction), 150);
  }
  if (scoreNum.innerHTML > 200) {
    clearInterval(interval);
    interval = setInterval(() => move(direction), 100);
  }
}

//Random apple//
function setRandom() {
  random = Math.floor(Math.random() * width * height);
  if (snake.includes(random)) {
    setRandom();
  } else {
    const divs = board.querySelectorAll("div");
    divs.forEach((el) => el.classList.remove("apple"));
    divs[random].classList.add("apple");
  }
}

//Game-Over//
function gameOver() {
  isGameOver = true;
  audio.src = "./sound/Country_Blues.ogg";
  audio.play();
  setTimeout(() => {
    let gameOverMssg = document.createElement("div");
    gameOverMssg.innerHTML = "!Game-Over";
    gameOverMssg.classList.add("game-over");
    document.body.appendChild(gameOverMssg);
    let btnReload = document.createElement("button");
    btnReload.classList.add("btnReload");
    btnReload.textContent = "!Try Again";
    gameOverMssg.appendChild(btnReload);
    btnReload.addEventListener("click", () => {
      location.reload();
    });
  }, 200);
}

//High-Score//
let highScore = document.getElementById("Highest-Score");
highScore.innerHTML = localStorage.topScore;
let btnReset = document.getElementById("btn-reset");
btnReset.addEventListener("click", () => {
  localStorage.clear();
  highScore.innerHTML = 0;
});
function setHighScore() {
  if (!localStorage.topScore) {
    localStorage.topScore = 0;
    highScore.innerHTML = 0;
  }
  if (+localStorage.topScore < +scoreNum.innerHTML) {
    localStorage.topScore = scoreNum.innerHTML;
  } else {
    highScore.innerHTML = localStorage.topScore;
  }
}
setHighScore();

//Timer//

function timer() {
  let timer = 0;
  setInterval(() => {
    timer++;
    document.querySelector("#timer").innerHTML = timer;
    const date = new Date(timer * 1000);
    let m = date.getMinutes();
    let s = date.getSeconds();
    document.querySelector("#timer").innerHTML = `${m < 10 ? "0" + m : m}:${
      s < 10 ? "0" + s : s
    }`;
  }, 1000);
}

//Sound//
function sound() {
  let sound = document.getElementById("sound");
  let isMuted = false;
  let volumeUp = document.createElement("img");
  volumeUp.src = "./images/volume.png";
  let volumeDown = document.createElement("img");
  volumeDown.src = "./images/no-sound.png";
  sound.appendChild(volumeUp);
  sound.addEventListener("click", () => {
    if (isMuted) {
      sound.appendChild(volumeUp);
      volumeDown.remove();
      isMuted = false;
      audio.muted = false;
    } else {
      sound.appendChild(volumeDown);
      volumeUp.remove();
      isMuted = true;
      audio.muted = true;
    }
  });
}
sound();

//Start-Game//
startGame.addEventListener("click", () => {
  timer();
  startGame.remove();
  window.addEventListener("keydown", (ev) => {
    ev.preventDefault();
    switch (ev.key) {
      case "ArrowUp":
        move("up");
        break;
      case "ArrowRight":
        move("right");
        break;
      case "ArrowDown":
        move("down");
        break;
      case "ArrowLeft":
        move("left");
        break;
      case "p":
        clearInterval(interval);
        break;
    }
  });
});

function checkScreenWidth() {
  if (window.innerWidth < 330) {
    alert(
      "Screen width is below 330 pixels! Game is still playble but for better experience switch to a bigger screen"
    );
  }
}
window.addEventListener("load", checkScreenWidth());
