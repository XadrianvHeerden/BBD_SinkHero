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

let ball = { x: 0, y: 0, vx: 1, vy: 1, v: 200 }

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

let oldTimeStamp = 0;
const animationSpeed = 1; // Adjust as needed

function animate(timeStamp) {
    const timePassed = (timeStamp - oldTimeStamp) / 1000.0;
    oldTimeStamp = timeStamp;
    const speed = timePassed / animationSpeed;
    
    ball.x += ball.v * ball.vx * speed;
    ball.y += ball.v * ball.vy * speed;

    ball.x = (ball.x < 0) ? 0 : ball.x;
    ball.x = (ball.x > 500) ? 500: ball.x;
    ball.y = (ball.y < 0) ? 0 : ball.y;
    ball.y = (ball.y > 500) ? 500: ball.y;
    
    let canvas = document.getElementById("maze");
    let ctx = canvas.getContext("2d");
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, 10, 0, 2 * Math.PI);
    ctx.stroke();
    
    window.requestAnimationFrame(animate);
}
window.requestAnimationFrame(animate);

window.addEventListener("deviceorientation", (event) => {
    const x = event.alpha / 360;
    const y = event.beta / 180;
    const z = event.gamma / 90;
    
    ball.vx = z;
    ball.vy = y;

    let stats = document.getElementById("stats");
    // stats.innerText = "hello";
    stats.innerText = `a: ${x}, b: ${y}, g: ${z}`; 
}, true);


draw_maze(MAZE);