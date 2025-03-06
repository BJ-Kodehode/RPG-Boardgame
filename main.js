// Definer spillbrett dynamisk
let gridSize = 5;
let gameBoard = [];
let monsterPositions = [];

// Spillerobjekt
let player = {
    x: 0, // Startposisjon rad
    y: 0, // Startposisjon kolonne
    inventory: [],
    
    move: function(direction) {
        let newX = this.x;
        let newY = this.y;

        if (direction === 'up' && this.x > 0) newX--;
        if (direction === 'down' && this.x < gridSize - 1) newX++;
        if (direction === 'left' && this.y > 0) newY--;
        if (direction === 'right' && this.y < gridSize - 1) newY++;

        // Sjekk interaksjoner
        if (gameBoard[newX][newY] === 'T') {
            this.collectTreasure(newX, newY);
        } else if (gameBoard[newX][newY] === 'M') {
            this.fightMonster();
            return;
        } else if (gameBoard[newX][newY] === 'D' && this.inventory.length === 3) {
            document.getElementById("gameMessages").textContent = "Victory! You collected all treasures!";
            document.removeEventListener('keydown', handleKeyPress);
            return;
        }

        // Flytt spilleren
        this.x = newX;
        this.y = newY;
        moveMonsters();
        renderBoard();
    },
    
    collectTreasure: function(x, y) {
        this.inventory.push('Treasure');
        gameBoard[x][y] = '';
        document.getElementById("gameMessages").textContent = `Treasure collected! Treasures left: ${3 - this.inventory.length}`;
        if (this.inventory.length === 3) {
            document.getElementById("gameMessages").textContent = "All treasures collected! Find the door!";
        }
    },
    
    fightMonster: function() {
        document.getElementById("gameMessages").textContent = "Game Over! You landed on a monster.";
        document.removeEventListener('keydown', handleKeyPress);
    }
};

// Funksjon for å flytte monstre tilfeldig
function moveMonsters() {
    let newBoard = gameBoard.map(row => row.slice()); // Klon brett
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (gameBoard[i][j] === 'M') {
                let directions = [
                    { x: -1, y: 0 }, { x: 1, y: 0 },
                    { x: 0, y: -1 }, { x: 0, y: 1 }
                ];
                let validMoves = directions.filter(d => {
                    let newX = i + d.x, newY = j + d.y;
                    return newX >= 0 && newX < gridSize && newY >= 0 && newY < gridSize && newBoard[newX][newY] === '';
                });
                if (validMoves.length > 0) {
                    let move = validMoves[Math.floor(Math.random() * validMoves.length)];
                    newBoard[i][j] = '';
                    newBoard[i + move.x][j + move.y] = 'M';
                }
            }
        }
    }
    gameBoard = newBoard;
}

// Funksjon for å håndtere tastetrykk
function handleKeyPress(event) {
    if (event.key === 'ArrowUp') player.move('up');
    if (event.key === 'ArrowDown') player.move('down');
    if (event.key === 'ArrowLeft') player.move('left');
    if (event.key === 'ArrowRight') player.move('right');
}

// Funksjon for å starte spillet dynamisk
function startGame() {
    gridSize = parseInt(document.getElementById("boardSize").value);
    gameBoard = Array.from({ length: gridSize }, () => Array(gridSize).fill(''));
    monsterPositions = [];
    player.x = 0;
    player.y = 0;
    player.inventory = [];
    placeElements();
    renderBoard();
    updatePlayerStats();
    // Lytt etter tastetrykk
    document.addEventListener('keydown', handleKeyPress);
}

// Oppdatert renderBoard-funksjon
function renderBoard() {
    let boardContainer = document.getElementById("gameBoard");
    boardContainer.innerHTML = ''; // Clear the board

    let table = document.createElement('table');
    for (let i = 0; i < gridSize; i++) {
        let row = document.createElement('tr');

        for (let j = 0; j < gridSize; j++) {
            let cell = document.createElement('td');

            // Vis spiller
            if (player.x === i && player.y === j) {
                cell.classList.add('player');
                cell.textContent = 'P'; // Player
            } 
            // Vis skatter
            else if (gameBoard[i][j] === 'T') {
                cell.classList.add('treasure');
                cell.textContent = 'T'; // Treasure
            }
            // Vis monstre
            else if (gameBoard[i][j] === 'M') {
                cell.classList.add('monster');
                cell.textContent = 'M'; // Monster
            }
            // Vis dør
            else if (gameBoard[i][j] === 'D') {
                cell.classList.add('door');
                cell.textContent = 'D'; // Door
            } else {
                cell.textContent = ''; // Empty cell
            }

            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    boardContainer.appendChild(table);
}

// Oppdater spillerens stats
function updatePlayerStats() {
    document.getElementById("playerStats").textContent = `Inventory: ${player.inventory.length} treasures collected`;
}

// Funksjon for å plassere elementene (skatter, monstre og dør)
function placeElements() {
    let numTreasures = 3; // Antall skatter
    let numMonsters = 3;  // Antall monstre
    let doorPlaced = false;

    // Plasser skatter
    while (numTreasures > 0) {
        let x = Math.floor(Math.random() * gridSize);
        let y = Math.floor(Math.random() * gridSize);
        if (gameBoard[x][y] === '') {
            gameBoard[x][y] = 'T';
            numTreasures--;
        }
    }

    // Plasser monstre
    while (numMonsters > 0) {
        let x = Math.floor(Math.random() * gridSize);
        let y = Math.floor(Math.random() * gridSize);
        if (gameBoard[x][y] === '') {
            gameBoard[x][y] = 'M';
            numMonsters--;
        }
    }

    // Plasser dør
    while (!doorPlaced) {
        let x = Math.floor(Math.random() * gridSize);
        let y = Math.floor(Math.random() * gridSize);
        if (gameBoard[x][y] === '') {
            gameBoard[x][y] = 'D';
            doorPlaced = true;
        }
    }
}

// Lytt etter tastetrykk når dokumentet er lastet
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("startGameButton").addEventListener("click", startGame);
});
