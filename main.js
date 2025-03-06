// Definer spillbrett dynamisk
let gridSize = 5; // Definerer størrelsen på brettet (5x5)
let gameBoard = []; // Spillbrettet
let monsterPositions = []; // Lager en liste for monsterposisjoner

// Spillerobjekt
let player = {
    x: 0, // Startposisjon rad
    y: 0, // Startposisjon kolonne
    inventory: [], // Samling av skatter

    // Funksjon for å flytte spilleren
    move: function(direction) {
        let newX = this.x;
        let newY = this.y;

        // Bestem retningen spilleren skal bevege seg
        if (direction === 'up' && this.x > 0) newX--;  // Flytt opp
        if (direction === 'down' && this.x < gridSize - 1) newX++;  // Flytt ned
        if (direction === 'left' && this.y > 0) newY--;  // Flytt venstre
        if (direction === 'right' && this.y < gridSize - 1) newY++;  // Flytt høyre

        // Sjekk hva spilleren står på etter bevegelsen
        if (gameBoard[newX][newY] === 'T') {
            this.collectTreasure(newX, newY); // Samle skatt
        } else if (gameBoard[newX][newY] === 'M') {
            this.fightMonster(); // Møte monster - spilleren taper
            return;
        } else if (gameBoard[newX][newY] === 'D' && this.inventory.length === 3) {
            // Hvis spilleren har alle skattene og treffer døren, vinner de
            document.getElementById("gameMessages").textContent = "Victory! You collected all treasures!";
            document.removeEventListener('keydown', handleKeyPress);  // Stopper bevegelseshendelser
            return;
        }

        // Oppdater spillerens posisjon
        this.x = newX;
        this.y = newY;
        moveMonsters();  // Beveg monstre
        renderBoard();  // Oppdater spillbrettet
    },

    // Funksjon for å samle skatt
    collectTreasure: function(x, y) {
        this.inventory.push('Treasure'); // Legg skatt til inventaret
        gameBoard[x][y] = ''; // Fjern skatten fra brettet
        document.getElementById("gameMessages").textContent = `Treasure collected! Treasures left: ${3 - this.inventory.length}`;
        if (this.inventory.length === 3) {
            document.getElementById("gameMessages").textContent = "All treasures collected! Find the door!";
        }
    },

    // Funksjon for å håndtere møtet med et monster
    fightMonster: function() {
        document.getElementById("gameMessages").textContent = "Game Over! You landed on a monster.";
        document.removeEventListener('keydown', handleKeyPress);  // Stopper bevegelseshendelser
    }
};

// Funksjon for å flytte monstre tilfeldig
function moveMonsters() {
    let newBoard = gameBoard.map(row => row.slice()); // Klon brett for å unngå å endre brettet mens vi går gjennom det
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (gameBoard[i][j] === 'M') {  // Hvis det er et monster på denne posisjonen
                let directions = [
                    { x: -1, y: 0 }, { x: 1, y: 0 },
                    { x: 0, y: -1 }, { x: 0, y: 1 }
                ]; // Mulige retninger monsteret kan bevege seg i
                let validMoves = directions.filter(d => {
                    let newX = i + d.x, newY = j + d.y;
                    return newX >= 0 && newX < gridSize && newY >= 0 && newY < gridSize && newBoard[newX][newY] === '';
                }); // Sjekk hvilke bevegelser som er gyldige
                if (validMoves.length > 0) {
                    let move = validMoves[Math.floor(Math.random() * validMoves.length)];  // Velg en tilfeldig gyldig bevegelse
                    newBoard[i][j] = '';  // Fjern monsteret fra den gamle posisjonen
                    newBoard[i + move.x][j + move.y] = 'M';  // Sett monsteret på den nye posisjonen
                }
            }
        }
    }
    gameBoard = newBoard; // Oppdater brettet med de nye monsterposisjonene
}

// Funksjon for å håndtere tastetrykk (bevegelser)
function handleKeyPress(event) {
    if (event.key === 'ArrowUp') player.move('up');
    if (event.key === 'ArrowDown') player.move('down');
    if (event.key === 'ArrowLeft') player.move('left');
    if (event.key === 'ArrowRight') player.move('right');
}

// Funksjon for å starte spillet dynamisk
function startGame() {
    gridSize = parseInt(document.getElementById("boardSize").value);  // Hent valgt brettstørrelse fra input
    gameBoard = Array.from({ length: gridSize }, () => Array(gridSize).fill(''));  // Lag et tomt spillbrett
    monsterPositions = []; // Tøm liste for monsterposisjoner
    player.x = 0;  // Startspilleren på posisjon (0, 0)
    player.y = 0;
    player.inventory = []; // Tøm spillerens inventar
    placeElements();  // Plasser skatter, monstre og dør på brettet
    renderBoard();  // Render brettet
    updatePlayerStats();  // Oppdater spillerstatistikk
    document.addEventListener('keydown', handleKeyPress);  // Lytt etter tastetrykk for bevegelse
}

// Funksjon for å renderere brettet
function renderBoard() {
    let boardContainer = document.getElementById("gameBoard");
    boardContainer.innerHTML = '';  // Tøm brettets HTML

    let table = document.createElement('table');  // Lag en tabell for å representere brettet
    for (let i = 0; i < gridSize; i++) {
        let row = document.createElement('tr');  // Lag en rad for tabellen

        for (let j = 0; j < gridSize; j++) {
            let cell = document.createElement('td');  // Lag en celle for hver posisjon på brettet

            // Vis spiller
            if (player.x === i && player.y === j) {
                cell.classList.add('player');
                cell.textContent = 'P';  // Player
            } 
            // Vis skatter
            else if (gameBoard[i][j] === 'T') {
                cell.classList.add('treasure');
                cell.textContent = 'T';  // Treasure
            }
            // Vis monstre
            else if (gameBoard[i][j] === 'M') {
                cell.classList.add('monster');
                cell.textContent = 'M';  // Monster
            }
            // Vis dør
            else if (gameBoard[i][j] === 'D') {
                cell.classList.add('door');
                cell.textContent = 'D';  // Door
            } else {
                cell.textContent = '';  // Empty cell
            }

            row.appendChild(cell);  // Legg cellen til raden
        }
        table.appendChild(row);  // Legg raden til tabellen
    }
    boardContainer.appendChild(table);  // Legg tabellen til spillbrett-containeren
}

// Funksjon for å oppdatere spillerens statistikk
function updatePlayerStats() {
    document.getElementById("playerStats").textContent = `Inventory: ${player.inventory.length} treasures collected`;
}

// Funksjon for å plassere elementene (skatter, monstre og dør)
function placeElements() {
    let numTreasures = 3;  // Antall skatter
    let numMonsters = 3;  // Antall monstre
    let doorPlaced = false;  // Sjekk om døren er plassert

    // Plasser skatter
    while (numTreasures > 0) {
        let x = Math.floor(Math.random() * gridSize);
        let y = Math.floor(Math.random() * gridSize);
        if (gameBoard[x][y] === '') {
            gameBoard[x][y] = 'T';  // Plasser skatt på tomt sted
            numTreasures--;  // Reduser antall skatter som er igjen
        }
    }

    // Plasser monstre
    while (numMonsters > 0) {
        let x = Math.floor(Math.random() * gridSize);
        let y = Math.floor(Math.random() * gridSize);
        if (gameBoard[x][y] === '') {
            gameBoard[x][y] = 'M';  // Plasser monster på tomt sted
            numMonsters--;  // Reduser antall monstre som er igjen
        }
    }

    // Plasser dør
    while (!doorPlaced) {
        let x = Math.floor(Math.random() * gridSize);
        let y = Math.floor(Math.random() * gridSize);
        if (gameBoard[x][y] === '') {
            gameBoard[x][y] = 'D';  // Plasser døren på tomt sted
            doorPlaced = true;  // Døren er nå plassert
        }
    }
}

// Lytt etter tastetrykk når dokumentet er lastet
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("startGameButton").addEventListener("click", startGame);  // Start spillet ved knappetrykk
});
