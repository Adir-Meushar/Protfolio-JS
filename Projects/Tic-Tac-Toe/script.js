const cells = document.querySelectorAll('.cell');
const statusText = document.querySelector('#statusText');
const restartBtn = document.querySelector('#restartBtn');
let scoreX = document.getElementById('scoreX');
let scoreO = document.getElementById('scoreO');
const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];
function chooseRandomPlayer() {
    let players = ['X', 'O'];
    let randomPlayer = players[Math.floor(Math.random() * players.length)];
    return randomPlayer;
}
let options = ['', '', '', '', '', '', '', '', '',];
let currentPlayer = chooseRandomPlayer();
let running = false;

initializeGame()

function initializeGame() {
    cells.forEach(cell => cell.addEventListener('click', cellClicked));
    restartBtn.addEventListener('click', restartGame);
    statusText.textContent = `${currentPlayer}'s turn`;
    running = true;
}

function cellClicked() {
    const cellIndex = this.getAttribute('cellIndex');
    if (options[cellIndex] != '' || !running) {
        return;
    }
    updateCell(this, cellIndex);
    checkWinner();

}

function updateCell(cell, index) {
    options[index] = currentPlayer;
    cell.textContent = currentPlayer;
}

function changePlayer() {
    currentPlayer = (currentPlayer == 'X') ? 'O' : 'X';
    statusText.textContent = `${currentPlayer}'s turn`
}

function checkWinner() {
    let roundWon = false;
    for (let i = 0; i < winConditions.length; i++) {
        const condtion = winConditions[i];
        const cellA = options[condtion[0]];
        const cellB = options[condtion[1]];
        const cellC = options[condtion[2]];
        if (cellA == '' || cellB == '' || cellC == '') {
            continue;
        } if (cellA == cellB && cellB == cellC) {
            roundWon = true;
            break;
        }
    }
    if (roundWon) {
        statusText.textContent = `${currentPlayer} Wins!`;
        running = false;
        if (currentPlayer == 'X') {
            scoreX.innerHTML++;
        } else if (currentPlayer == 'O') {
            scoreO.innerHTML++;
        }
    } else if (!options.includes('')) {
        statusText.textContent = 'Draw!';
        running = false;
    } else {
        changePlayer();
    }
}

function restartGame() {
    currentPlayer = chooseRandomPlayer();
    options = ['', '', '', '', '', '', '', '', '',];
    statusText.textContent = `${currentPlayer}'s turn`;
    cells.forEach(cell => cell.textContent = '');
    running = true;
}
