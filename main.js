// Game board (2D array)
let gameBoard = [
    ['', '', 'T', '', ''],
    ['M', '', '', 'T', ''],
    ['', 'T', 'M', '', ''],
    ['', '', '', 'M', ''],
    ['', 'M', '', '', 'D']
];

// Player object
let player = {
    x: 0, // Starting row
    y: 0, // Starting column
    health: 100,
    inventory: [],
    move: function(direction) {
        let newX = this.x;
        let newY = this.y;

        if (direction === 'up' && this.x > 0) newX--;
        if (direction === 'down' && this.x < 4) newX++;
        if (direction === 'left' && this.y > 0) newY--;
        if (direction === 'right' && this.y < 4) newY++;

        // Check interactions
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

        // Move player
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

// Function to move monsters randomly
function moveMonsters() {
    let newBoard = gameBoard.map(row => row.slice()); // Clone board
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
            if (gameBoard[i][j] === 'M') {
                let directions = [
                    { x: -1, y: 0 }, { x: 1, y: 0 },
                    { x: 0, y: -1 }, { x: 0, y: 1 }
                ];
                let validMoves = directions.filter(d => {
                    let newX = i + d.x, newY = j + d.y;
                    return newX >= 0 && newX < 5 && newY >= 0 && newY < 5 && newBoard[newX][newY] === '';
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

// Function to render the game board
function renderBoard() {
    let table = document.getElementById("gameBoard");
    table.innerHTML = "";
    for (let i = 0; i < 5; i++) {
        let row = table.insertRow();
        for (let j = 0; j < 5; j++) {
            let cell = row.insertCell();
            if (i === player.x && j === player.y) {
                cell.classList.add('player');
                cell.textContent = 'P';
            } else if (gameBoard[i][j] === 'T') {
                cell.classList.add('treasure');
                cell.textContent = 'T';
            } else if (gameBoard[i][j] === 'M') {
                cell.classList.add('monster');
                cell.textContent = 'M';
            } else if (gameBoard[i][j] === 'D') {
                cell.classList.add('door');
                cell.textContent = 'D';
            }
        }
    }
    updatePlayerStats();
}

// Function to update player stats
function updatePlayerStats() {
    document.getElementById("playerStats").textContent = `Treasures: ${player.inventory.length}/3`;
}

// Function to handle player movement
function handleKeyPress(event) {
    if (event.key === 'ArrowUp') player.move('up');
    if (event.key === 'ArrowDown') player.move('down');
    if (event.key === 'ArrowLeft') player.move('left');
    if (event.key === 'ArrowRight') player.move('right');
}

// Event listener for keypresses
document.addEventListener('keydown', handleKeyPress);

// Initial setup
renderBoard();
updatePlayerStats();
