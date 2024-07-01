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

let ball = { x: 0, y: 0, vx: 1, vy: 1, v: 300, ax: 1, ay: 1, a: 10 }

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

function clamp(value, min, max) {
    return (value < -min) ? min : (value > max) ? max : value;
}

let stats = document.getElementById("stats");

function animate(timeStamp) {
    let canvas = document.getElementById("maze");
    let ctx = canvas.getContext("2d");

    const timePassed = (timeStamp - oldTimeStamp) / 1000.0;
    oldTimeStamp = timeStamp;
    const speed = timePassed / animationSpeed;
    const MAX_VEL = 300;
    
    ball.vx += ball.ax * ball.a * speed;
    ball.vy += ball.ay * ball.a * speed;

    ball.vx = clamp(ball.vx, -MAX_VEL, MAX_VEL);
    ball.vy = clamp(ball.vy, -MAX_VEL, MAX_VEL);
    
    vm = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);

    ball.x += (ball.vx/vm) * speed;
    ball.y += (ball.vy/vm) * speed;

    ball.x = clamp(ball.x, 0, 500);
    ball.y = clamp(ball.y, 0, 500);
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, 10, 0, 2 * Math.PI);
    ctx.stroke();

    // stats.innerText = "hello";
    stats.innerText = `x: ${ball.x}, y: ${ball.y}, ax: ${ball.ax}, ay: ${ball.ay}, vx: ${ball.vx}, vy: ${ball.vy}`; 

    window.requestAnimationFrame(animate);
}

window.requestAnimationFrame(animate);

window.addEventListener("deviceorientation", (event) => {
    const x = event.alpha / 360;
    const y = event.beta / 180;
    const z = event.gamma / 90;
    
    ball.ax = z;
    ball.ay = y;
}, true);


draw_maze(MAZE);