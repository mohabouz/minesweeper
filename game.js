class Cell {
    constructor(x, y, node) {
        this.x = x;
        this.y = y;
        this.revealed = false;
        this.bomb = false;
        this.neighbourBombs = -1;
        this.marked = false;
        this.node = node;
    }

    addColorClass() {
        if (this.neighbourBombs === 1) this.node.classList.add("green");
        else if (this.neighbourBombs === 2) this.node.classList.add("blue");
        else if (this.neighbourBombs > 2) this.node.classList.add("red");
    }
}

class Bomb {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

/**
 *
 *
 * @class Minesweeper
 */

class Minesweeper {

    /**
     * Creates an instance of Minesweeper.
     * @param {String} containerSelector (The id of the containing `DIV`)
     * @param {String} restartSelector (The id of the restart button)
     * @param {Number} gridWidth (Game's Number of columns)
     * @param {Number} gridHeight (Game's Number of rows)
     * @param {Number} bombsNumber (Game's Number of Bombs)
     */
    constructor(containerSelector, restartSelector, gridWidth, gridHeight, bombsNumber) {
        this.gridWidth = gridWidth;
        this.gridHeight = gridHeight;
        this.bombsNumber = bombsNumber > (this.gridWidth * this.gridHeight) ?
            (this.gridWidth * this.gridHeight) / 2 : bombsNumber;
        this.gameContainer = document.querySelector(containerSelector);
        this.restartBtn = document.querySelector(restartSelector);

        this.bombsLocations = [];
        this.cells = [];
        this.markedCellsCount = 0;
        this.firstClick = true;  // To track if it's the first click
        this.gameContainer.style.gridTemplateColumns = `repeat(${this.gridWidth}, 30px)`;
    }

    init() {
        this.restartBtn.addEventListener('click', () => this.setupGame());
        this.setupGame();

        this.gameContainer.addEventListener('click', (e) => this.handleCellClick(e));
        this.gameContainer.addEventListener('contextmenu', (e) => this.handleCellRightClick(e));
    }

    drawGrid() {
        this.cells = [];
        this.gameContainer.innerHTML = "";

        for (let i = 0; i < this.gridHeight; i++) {
            let row = [];
            for (let j = 0; j < this.gridWidth; j++) {
                let el = document.createElement("div");
                el.dataset.id = `${i},${j}`;
                el.classList.add("cell");

                // Create a new Cell instance
                let cell = new Cell(i, j, el);
                row.push(cell);
                this.gameContainer.appendChild(el);
            }
            this.cells.push(row);
        }
    }

    getNeighbours(i, j) {
        let rowLimit = this.cells.length - 1;
        let columnLimit = this.cells[0].length - 1;
        let neighbors = [];
        for (let x = Math.max(0, i - 1); x <= Math.min(i + 1, rowLimit); x++) {
            for (let y = Math.max(0, j - 1); y <= Math.min(j + 1, columnLimit); y++) {
                if (x !== i || y !== j) {
                    neighbors.push(this.cells[x][y]);
                }
            }
        }
        return neighbors;
    }

    bombsCount(neighboursArray) {
        return neighboursArray.filter(neighbour => neighbour.bomb).length;
    }

    randomBetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    generateBombsPlaces(excludeX, excludeY) {
        console.log(`\{x: ${excludeX} , y: ${excludeY}\}`)
        this.bombsLocations = [];
        let bombsCounter = 0;

        while (bombsCounter < this.bombsNumber) {
            let x = this.randomBetween(0, this.gridWidth - 1);
            let y = this.randomBetween(0, this.gridHeight - 1);

            if (x == excludeX && y == excludeY)
                continue;

            if (this.bombsLocations.some(b => b.x === x && b.y === y))
                continue;

            this.bombsLocations.push(new Bomb(x, y));
            bombsCounter++;
        }
    }

    setBombs() {
        this.bombsLocations.forEach(bomb => {
            this.cells[bomb.y][bomb.x].bomb = true;
        });
    }

    setNeighborsCount() {
        this.cells.forEach(row => {
            row.forEach(cell => {
                if (!cell.bomb) {
                    cell.neighbourBombs = this.bombsCount(this.getNeighbours(cell.x, cell.y));
                }
            });
        });
    }

    revealAll() {
        this.cells.flat().forEach(cell => {
            setTimeout(() => {
                cell.node.classList.add("revealed");
                cell.revealed = true;
                cell.node.innerHTML = cell.neighbourBombs > 0 ? cell.neighbourBombs : "";
                if (cell.bomb) cell.node.classList.add("bomb");
                cell.addColorClass();
            }, 200);
        });
    }

    reveal(x, y) {
        let cell = this.cells[x][y];
        if (cell.revealed || cell.marked) return;

        cell.revealed = true;
        cell.node.classList.add("revealed");
        cell.node.innerHTML = cell.neighbourBombs > 0 ? cell.neighbourBombs : "";
        cell.addColorClass();

        if (cell.bomb) {
            this.revealAll();
            return;
        }

        if (cell.neighbourBombs === 0) {
            this.getNeighbours(x, y).forEach(neighbour => {
                if (!neighbour.revealed && !neighbour.bomb) this.reveal(neighbour.x, neighbour.y);
            });
        }
    }

    mark(x, y) {
        let cell = this.cells[x][y];
        if (cell.revealed) return;

        cell.marked = !cell.marked;
        cell.node.classList.toggle("marked");

        if (cell.bomb) {
            this.markedCellsCount += cell.marked ? 1 : -1;
            if (this.markedCellsCount === this.bombsNumber) {
                alert("Congrats, you've completed the game.");
                this.revealAll();
            }
        }
    }

    handleCellClick(e) {
        if (e.target.classList.contains("cell")) {
            let [x, y] = e.target.dataset.id.split(",").map(Number);

            if (this.firstClick) {
                this.generateBombsPlaces(x, y);  // Exclude the first-clicked cell
                this.setBombs();
                this.setNeighborsCount();
                this.firstClick = false;
            }

            this.reveal(x, y);
        }
    }

    handleCellRightClick(e) {
        e.preventDefault();
        if (e.target.classList.contains("cell")) {
            let [x, y] = e.target.dataset.id.split(",").map(Number);
            this.mark(x, y);
        }
    }

    setupGame() {
        this.firstClick = true;  // Reset for new game
        this.markedCellsCount = 0;
        this.drawGrid();
    }
}

