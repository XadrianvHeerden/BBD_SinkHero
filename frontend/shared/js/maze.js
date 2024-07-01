import { BoundingBox, Vector2 } from "./physics.js";

let maze = {
    data: [
        [1, 1, 1, 1],
        [1, 0, 0, 1],
        [0, 0, 0, 0],
        [1, 0, 0, 1],
        [1, 0, 0, 1],
        [1, 1, 0, 1],
    ],
    bounds: [],
}

maze.rows = maze.data.length;
maze.columns = maze.data[0].length;

const TILE_SIZE = 32;

function generate_bounds(maze) {
    let stack = [new Vector2(0, 0)];
    let current = null;

    while (stack.length > 0) {
        if (current == null)
            current = stack.pop();

        if (!stack.length) {
            if (maze.data[current.y + 1][current.x] && maze.data[current.y][current.x + 1]) {
                stack.push(current);
            }
        }
        
    }
}

function recurse(maze, row, column, visited = [], bound = null, direction = null) {
    if (row >= (maze.rows - 1) || column >= (maze.columns - 1)) {
        if (bound) 
            maze.bounds.push(bound);

        return;
    }

    const current = new Vector2(row, column);

    visited.forEach(element => {
        if (element.equals(current))
            return;
    })

    visited.push(current);

    if (!bound && maze.data[row][column]) {
        bound = new BoundingBox(
            column * TILE_SIZE,
            row * TILE_SIZE,
            TILE_SIZE,
            TILE_SIZE);
    }

    if (bound && direction) {
        bound.width += direction.x * TILE_SIZE;
        bound.height += direction.y * TILE_SIZE;
    }

    if (maze.data[row+1][column]) {
        if (direction && !direction.equals(Vector2.DOWN)) {
            maze.bounds.push(bound);
            bound = null;
            direction = null;
        }
        else if (!direction) {
            direction = Vector2.DOWN;
        }

        recurse(maze, row + 1, column, visited, bound, direction);
    }

    if (maze.data[row][column+1]) {
        if (direction && !direction.equals(Vector2.RIGHT)) {
            maze.bounds.push(bound);
            bound = null;
            direction = null;
        }
        else if (!direction) {
            direction = Vector2.RIGHT
        }

        recurse(maze, row, column + 1, visited, bound, direction);
    }
    // else {
    //     if (bound)
    //         maze.bounds.push(bound);

    //     recurse(maze, row + 1, column, visited, null, null);
    //     recurse(maze, row, column + 1, visited, null, null);
    // }
}

recurse(maze, 0, 0)

console.log(maze.bounds);

function draw_maze(maze) {
    let canvas = document.getElementById("maze");
    let ctx = canvas.getContext("2d");

    for (let i = 0; i < maze.rows; i++) {
        for (let j = 0; j < maze.columns; j++) {
            ctx.fillStyle = maze.data[i][j] ? "#58A8D8" : "transparent";
            ctx.fillRect(j * TILE_SIZE, i * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
    }
}

draw_maze(maze);