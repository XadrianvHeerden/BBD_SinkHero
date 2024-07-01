
const MAZE = [
    [1, 1, 1, 1],
    [1, 0, 0, 1],
    [0, 0, 0, 0],
    [1, 0, 0, 1],
    [1, 0, 0, 1],
    [1, 1, 0, 1],
];

const ROWS = MAZE.length, COLUMNS = MAZE[0].length;
const TILE_SIZE = 64;

function draw_maze(maze) {
    let canvas = document.getElementById("maze");
    let ctx = canvas.getContext("2d");

    for (let i = 0; i < ROWS; i++) {
        for (let j = 0; j < COLUMNS; j++) {
            ctx.fillStyle = MAZE[i][j] ? "#58A8D8" : "transparent"; // Set fill color
            ctx.fillRect(j * TILE_SIZE, i * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        }
    }
}

function handleOrientation(event) {
    const alpha = event.alpha; // Z-axis rotation
    const beta = event.beta;   // X-axis rotation
    const gamma = event.gamma; // Y-axis rotation

    let stats = document.getElementById("stats");
    stats.innerText = `a: ${alpha}, b: ${beta}, g: ${gamma}`; 
    // Your custom logic here based on the orientation data
}


window.addEventListener("deviceorientation", handleOrientation, true);



draw_maze(MAZE);