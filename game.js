import Cell from "./cell";

class Game {
    
    constructor(widht, height, totalBombsCount, container) {
        this.widht = widht;
        this.height = height;
        this.totalBombsCount = totalBombsCount;
        this.container = container;
        this.cells = [];
    }


    setupGame() {
        for (let i = 0; i < this.widht; i++) {
            tempArr = [];
            for (let j = 0; j < this.height; j++) {
                let el = document.createElement("div");
                let cell = new Cell(i, j, el);
                cell.el.dataset.id = `${i},${j}`;
                cell.el.classList.add("cell");
                tempArr.push(cell);
                this.container.appendChild(el);
            }
            this.cells.push(tempArr);
        }
    }

}