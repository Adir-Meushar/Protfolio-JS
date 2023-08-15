// Creating players//
let player1 = document.querySelector("#player-1");
let inputPlayer1 = document.querySelector("#inputPlayer1");
let player2 = document.querySelector("#player-2");
let inputPlayer2 = document.querySelector("#inputPlayer2");
let player1AttemptNum = document.createElement("span");
let player2AttemptNum = document.createElement("span");
player1AttemptNum.innerHTML = 0;
player2AttemptNum.innerHTML = 0;
let scorePlayer1Num = document.createElement("span");
scorePlayer1Num.innerHTML = 0;
let scorePlayer2Num = document.createElement("span");
scorePlayer2Num.innerHTML = 0;
//event for entering player name//
let player1Name = "";
let player2Name = "";
let difficultySelected = false;

//listing players & vallidation//
inputPlayer1.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    player1Name = inputPlayer1.value;
    if (player1Name.length <= 1 || /^\d+$/.test(player1Name)) {
      alert("Please enter a valid name.");
      return;
    }
    inputPlayer1.remove();
    player1.innerHTML += `<span style="color: black; margin-left: 132px;margin-bottom: 150px;position: absolute;top: 15px;right: 3%;">${player1Name}</span>`;
    let player1Attempt = document.querySelector("#attempts1");
    let scorePlayer1 = document.querySelector("#score1");
    player1Attempt.appendChild(player1AttemptNum);
    scorePlayer1.appendChild(scorePlayer1Num);
    checkStartGame();
  }
});

inputPlayer2.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    player2Name = inputPlayer2.value;
    if (player2Name.length <= 1 || /^\d+$/.test(player2Name)) {
      alert("Please enter a valid name.");
      return;
    }
    inputPlayer2.remove();
    player2.innerHTML += `<span style="color: black; margin-left: 132px;margin-bottom: 150px;position: absolute;top: 15px;right: 3%;">${player2Name}</span>`;
    let player2Attempt = document.querySelector("#attempts2");
    player2Attempt.appendChild(player2AttemptNum);
    let scorePlayer2 = document.querySelector("#score2");
    scorePlayer2.appendChild(scorePlayer2Num);
    checkStartGame();
  }
});

//choosing board size//
const sizes = [
  { element: document.getElementById("small"), amount: 9 },
  { element: document.getElementById("medium"), amount: 15 },
  { element: document.getElementById("large"), amount: 24 },
];

sizes.forEach((size) => {
  size.element.addEventListener("click", function () {
    sizes.forEach((size) => size.element.classList.remove("selected"));
    this.classList.add("selected");
    amount = size.amount;
    difficultySelected = true;
    checkStartGame();
  });
});
function startGame() {
  const numbers = [];
  const board = document.querySelector(".board");
  board.style.gridTemplateColumns = `repeat(6, 1fr)`;
  let counter = document.querySelector(".counter");
  //creating timer//
  let timer = 0;
  setInterval(() => {
    timer++;
    document.querySelector(".timer").innerHTML = timer;
    const date = new Date(timer * 1000);
    let m = date.getMinutes();
    let s = date.getSeconds();
    document.querySelector(".timer").innerHTML = `${m < 10 ? "0" + m : m}:${
      s < 10 ? "0" + s : s
    }`;
  }, 1000);

  //creating numbers for board//
  for (let i = 1; i <= amount; i++) {
    numbers.push(i, i);
  }

  for (let i = 1; i <= amount * 2; i++) {
    const rand = Math.floor(Math.random() * numbers.length);
    const div = document.createElement("div");
    div.innerHTML = `<span>${numbers[rand]}</span>`;
    board.appendChild(div);
    numbers.splice(rand, 1);
    div.addEventListener("click", (ev) => {
      if (ev.target.classList.contains("hidden")) {
        return;
      }
      if (board.querySelectorAll(".showing").length == 2) {
        return;
      }
      ev.target.classList.add("showing");
      check();
    });
  }

  player2.style.backgroundColor = "";
  player1.style.backgroundColor = "#36ccecbd";
  let playerTurn = 1;

  function switchPlayerTurn() {
    if (playerTurn === 1) {
      player1AttemptNum.innerHTML++;
      player1.style.backgroundColor = "";
      player2.style.backgroundColor = "#36ccecbd";
      playerTurn = 2;
    } else if (playerTurn === 2) {
      player2AttemptNum.innerHTML++;
      player2.style.backgroundColor = "";
      player1.style.backgroundColor = "#36ccecbd";
      playerTurn = 1;
    }
  }
  function check() {
    const cards = board.querySelectorAll(".showing");
    if (cards.length === 2) {
      const first = cards[0];
      const last = cards[1];
      counter.textContent = ++counter.textContent;
      if (first.textContent == last.textContent) {
        if (playerTurn === 1) {
          scorePlayer1Num.innerHTML++;
          player1AttemptNum.innerHTML++;
        } else {
          scorePlayer2Num.innerHTML++;
          player2AttemptNum.innerHTML++;
        }
        setTimeout(() => {
          first.classList.remove("showing");
          last.classList.remove("showing");
          first.classList.add("hidden");
          last.classList.add("hidden");
          checkIsComplete();
        }, 1000);
      } else {
        setTimeout(() => {
          first.classList.remove("showing");
          last.classList.remove("showing");
          switchPlayerTurn();
        }, 1500);
      }
    }
  }

  function checkIsComplete() {
    const cards = board.querySelectorAll("div:not(.hidden)");
    if (!cards.length) {
      confetti({
        particleCount: 100,
        spread: 70,
        decay: 0.9,
        origin: { y: 0.6 },
      });
      let winner = document.createElement("div");
      winner.classList.add("winner");
      if (+scorePlayer1Num.innerHTML > +scorePlayer2Num.innerHTML) {
        winner.innerHTML += `!${player1Name} wins`;
      } else if (+scorePlayer2Num.innerHTML > +scorePlayer1Num.innerHTML) {
        winner.innerHTML += `!${player2Name} wins`;
      }
      let btnRestart = document.createElement("button");
      btnRestart.textContent = "Restart";
      btnRestart.addEventListener("click", () => {
        location.reload();
      });
      winner.appendChild(btnRestart);
      document.body.appendChild(winner);
    }
  }
}

function checkStartGame() {
  if (player1Name && player2Name && difficultySelected) {
    startGame();
    document.getElementById("game-size").remove();
    document.getElementById("memory-img").remove();
  }
}

window.addEventListener("load", checkScreenSize);
window.addEventListener("resize", checkScreenSize);
function checkScreenSize() {
  let screenWidth =
    window.innerWidth ||
    document.documentElement.clientWidth ||
    document.body.clientWidth;
  if (screenWidth < 320) {
    alert("This screen size is not supported.");
  }
}
