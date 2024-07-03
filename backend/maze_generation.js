function GenerateMaze  (width, height)  {
    const cellSize = 60;
    let generatedMaze;

    const cols = Math.floor(width / cellSize);
    const rows = Math.floor(height / cellSize);

    class Cell {
        constructor(x, y) {
            this.cellSize = cellSize;
            this.x = x;
            this.y = y;
            this.visited = false;
            this.walls = {
                top: true,
                right: true,
                bottom: true,
                left: true
            };
        }

    }

    function mazeGenerator(cols, rows) {
        const grid = [];
        for (let x = 0; x < cols; x++) {
            grid[x] = [];
            for (let y = 0; y < rows; y++) {
                grid[x][y] = new Cell(x, y);
            }
        }

        const stack = [];
        const start = grid[0][0];
        start.visited = true;
        stack.push(start);

        while (stack.length > 0) {
            const current = stack[stack.length - 1];
            const next = getUnvisitedNeighbor(current, grid, cols, rows);

            if (next) {
                next.visited = true;
                stack.push(next);
                removeWalls(current, next);
            } else {
                stack.pop();
            }
        }

        const middleX = Math.floor(cols / 2);
        const middleY = Math.floor(rows / 2);
        end = grid[middleX][middleY];

        return grid;
    }

    function getUnvisitedNeighbor(cell, grid, cols, rows) {
        const neighbors = [];
        const { x, y } = cell;

        if (x > 0 && !grid[x - 1][y].visited) {
            neighbors.push(grid[x - 1][y]);
        }
        if (x < cols - 1 && !grid[x + 1][y].visited) {
            neighbors.push(grid[x + 1][y]);
        }
        if (y > 0 && !grid[x][y - 1].visited) {
            neighbors.push(grid[x][y - 1]);
        }
        if (y < rows - 1 && !grid[x][y + 1].visited) {
            neighbors.push(grid[x][y + 1]);
        }

        if (neighbors.length > 0) {
            const randomIndex = Math.floor(Math.random() * neighbors.length);
            return neighbors[randomIndex];
        } else {
            return undefined;
        }
    }

    function removeWalls(a, b) {
        const x = a.x - b.x;
        const y = a.y - b.y;

        if (x === 1) {
            a.walls.left = false;
            b.walls.right = false;
        } else if (x === -1) {
            a.walls.right = false;
            b.walls.left = false;
        }

        if (y === 1) {
            a.walls.top = false;
            b.walls.bottom = false;
        } else if (y === -1) {
            a.walls.bottom = false;
            b.walls.top = false;
        }
    }

    function addOuterBorder() {
        for (let x = 0; x < cols; x++) {
            generatedMaze[x][0].walls.top = true;
            generatedMaze[x][rows - 1].walls.bottom = true;
        }

        for (let y = 0; y < rows; y++) {
            generatedMaze[0][y].walls.left = true;
            generatedMaze[cols - 1][y].walls.right = true;
        }

        const entranceSide = Math.floor(Math.random() * 4);
        let entranceCell;

        switch (entranceSide) {
            case 0:
                entranceCell = generatedMaze[Math.floor(Math.random() * cols)][0];
                entranceCell.walls.top = false;
                break;
            case 1:
                entranceCell = generatedMaze[cols - 1][Math.floor(Math.random() * rows)];
                entranceCell.walls.right = false;
                break;
            case 2:
                entranceCell = generatedMaze[Math.floor(Math.random() * cols)][rows - 1];
                entranceCell.walls.bottom = false;
                break;
            case 3:
                entranceCell = generatedMaze[0][Math.floor(Math.random() * rows)];
                entranceCell.walls.left = false;
                break;
        }
    }

    function drawMaze() {
        for (let x = 0; x < cols; x++) {
            for (let y = 0; y < rows; y++) {
                generatedMaze[x][y].show();
            }
        }
    }

    function setup() {
        generatedMaze = mazeGenerator(cols, rows);
        addOuterBorder();
        // drawMaze();
    }

    setup();
    return generatedMaze;
}

module.exports = {
    GenerateMaze
}