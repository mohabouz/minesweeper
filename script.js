const querySelector = (selector) => {
    return document.querySelector(selector);
};
const gameContainer = querySelector("div#game_container");
const restartBtn = querySelector("button#restart");

const GRID_WIDTH = 20;
const GRID_HEIGHT = 20;
const BOMBS_NUMBER = 50;

let bombsLocations = [];
let cells = [];
let tempArr = [];

const drawGrid = () => {
    cells = [];
    gameContainer.innerHTML = "";
    for (let i = 0; i < GRID_HEIGHT; i++) {
        tempArr = [];
        for (let j = 0; j < GRID_WIDTH; j++) {
            let cellObj = {
                x: i,
                y: j,
                revealed: false,
                bomb: false,
                neighbourBombs: -1,
                marked: false,
                node: null
            }
            let el = document.createElement("div");
            el.dataset.id = `${i},${j}`;
            el.classList.add("cell");
            cellObj.node = el;
            tempArr.push(cellObj);
            gameContainer.appendChild(el);
        }
        cells.push(tempArr);
    }
};

const getNeighbours = (i, j) => {
    let rowLimit = cells.length - 1;
    let columnLimit = cells[0].length - 1;
    let temp = [];
    for (var x = Math.max(0, i - 1); x <= Math.min(i + 1, rowLimit); x++) {
        for (var y = Math.max(0, j - 1); y <= Math.min(j + 1, columnLimit); y++) {
            if (x !== i || y !== j) {
                temp.push(cells[x][y]);
            }
        }
    }
    return temp;
};

const bombsCount = (neighboursArray) => {
    let count = 0;
    for (let i = 0; i < neighboursArray.length; i++) {
        if (neighboursArray[i].bomb) {
            count++;
        }
    }

    return count;
};

const randomBetween = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min)
};

const generateBombsPlaces = () => {
    let bombsCounter = 0;
    bombsLocations = [];
    do {
        let obj = {
            x: randomBetween(0, GRID_WIDTH - 1),
            y: randomBetween(0, GRID_HEIGHT - 1)
        };

        if (!bombsLocations.includes(obj)) {
            bombsLocations.push(obj);
            bombsCounter++;
        }
    } while (bombsCounter < BOMBS_NUMBER);
};

const setBombs = () => {
    bombsLocations.forEach(obj => {
        cells[obj.y][obj.x].bomb = true;
    });
};

const setNeighborsCount = () => {
    for (let i = 0; i < cells.length; i++) {
        for (let j = 0; j < cells[i].length; j++) {
            if (!cells[i][j].bomb) {
                let mNeighbours = getNeighbours(i, j);
                cells[i][j].neighbourBombs = bombsCount(mNeighbours);
            }
        }
    }
};

const revealAll = () => {
    for (let i = 0; i < cells.length; i++) {
        for (let j = 0; j < cells[i].length; j++) {
            cells[i][j].node.classList.add("revealed");
            cells[i][j].revealed = true;
            cells[i][j].node.innerHTML = cells[i][j].neighbourBombs > 0 ? cells[i][j].neighbourBombs : "";
            if (cells[i][j].neighbourBombs == 1) {
                cells[i][j].node.classList.add("green")
            } else if (cells[i][j].neighbourBombs == 2) {
                cells[i][j].node.classList.add("blue")
            } else if (cells[i][j].neighbourBombs > 2) {
                cells[i][j].node.classList.add("red")
            }
            if (cells[i][j].bomb) {
                cells[i][j].node.classList.add("bomb");
            }
        }
    }
};

const reveal = (x, y) => {
    if (cells[x][y].bomb) {
        revealAll();
        return
    } else if (cells[x][y].neighbourBombs != 0) {
        cells[x][y].node.classList.add("revealed");
        cells[x][y].revealed = true;
        cells[x][y].node.innerHTML = cells[x][y].neighbourBombs > 0 ? cells[x][y].neighbourBombs : "";
        if (cells[x][y].neighbourBombs == 1) {
            cells[x][y].node.classList.add("green")
        } else if (cells[x][y].neighbourBombs == 2) {
            cells[x][y].node.classList.add("blue")
        } else if (cells[x][y].neighbourBombs > 2) {
            cells[x][y].node.classList.add("red")
        }

        return;
    } else {
        cells[x][y].node.classList.add("revealed");
        cells[x][y].revealed = true;
        let neighbors = getNeighbours(x, y);
        for (let i = 0; i < neighbors.length; i++) {
            if (!neighbors[i].revealed && !neighbors[i].bomb) {
                reveal(neighbors[i].x, neighbors[i].y);
            }
        }
    }
}

const mark = (x, y) => {
    if (cells[x][y].marked) {
        cells[x][y].marked = false;
        cells[x][y].node.classList.remove("marked");
    } else {
        cells[x][y].marked = true;
        cells[x][y].node.classList.add("marked");
    }
};

const setupGame = () => {
    drawGrid();
    generateBombsPlaces();
    setBombs();
    setNeighborsCount();
}

gameContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains("cell")) {
        let coordinates = e.target.dataset.id.split(",");
        let x = parseInt(coordinates[0]);
        let y = parseInt(coordinates[1]);
        if (!cells[x][y].marked) {
            if (!cells[x][y].bomb) {
                reveal(x, y);
            } else {
                revealAll();
            }
        }
    }
});

gameContainer.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    if (e.target.classList.contains("cell")) {
        let coordinates = e.target.dataset.id.split(",");
        let x = parseInt(coordinates[0]);
        let y = parseInt(coordinates[1]);
        if (!cells[x][y].revealed) {
            mark(x, y);
        }
    }
});

restartBtn.addEventListener('click', setupGame);

setupGame();