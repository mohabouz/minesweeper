export default class Cell {

    /**
     * @date 2022-02-05
     * @param {any} x
     * @param {any} y
     * @param {Node} node
     * @returns {any}
     */
    constructor(x, y, node) {
        this.x = x;
        this.y = y;
        this.revealed = false;
        this.marked = false;
        this.bomb = false;
        this.neighbourBombs = -1;
        this.node = node;
        this.neighborCount = 0;
    }

    reveal() {
        this.revealed = true;
        this.node.innerHTML = this.neighborCount;
    }


    /**
     * @description This method returns the number of bobms around a cell
     * @param {Cell[]} cells
     * @returns {Number}
     */
    getNeighborCount(cells) {
        let count = 0
        let neighborCells = this.getNeighborCells(cells);
        for (let i = 0; i < neighborCells.length; i++) {
            if (neighboursArray[i].bomb) {
                count++;
            }
        }
        return count;
    }

    /**
     * @param {Cell[]} cells
     * @returns {any}
     */
    getNeighborCells(cells) {
        let rowLimit = cells.length - 1;
        let columnLimit = cells[0].length - 1;
        let temp = [];
        for (var x = Math.max(0, this.x - 1); x <= Math.min(this.x + 1, rowLimit); x++) {
            for (var y = Math.max(0, this.y - 1); this.y <= Math.min(this.y + 1, columnLimit); y++) {
                if (x !== this.x || y !== this.y) {
                    temp.push(cells[x][y]);
                }
            }
        }
        return temp;
    }

    mark() {
        if (this.marked) {
            this.marked = false;
            this.node.classList.remove("marked");
        } else {
            this.marked = true;
            this.node.classList.add("marked");
        }
    }

};