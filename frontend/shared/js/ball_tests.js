import {clamp, round} from "./utils.js";

const MAX_VELOCITY = 300;
const MAX_ACCELARATION = 1000;

let ball = { x: 0, y: 0, vx: 1, vy: 1, ax: 1, ay: 1 }
let previousTimeStamp = 0;

// for debugging
let stats = document.getElementById("stats");

function animate(timeStamp) {
    let canvas = document.getElementById("maze");
    let ctx = canvas.getContext("2d");

    const delta = (timeStamp - previousTimeStamp) / 1000.0;
    previousTimeStamp = timeStamp;
    
    ball.vx += ball.ax * MAX_ACCELARATION * delta;
    ball.vy += ball.ay * MAX_ACCELARATION * delta;

    ball.vx = clamp(ball.vx, -MAX_VELOCITY, MAX_VELOCITY);
    ball.vy = clamp(ball.vy, -MAX_VELOCITY, MAX_VELOCITY);
    
    vm = Math.sqrt(ball.vx * ball.vx + ball.vy * ball.vy);

    ball.x += MAX_VELOCITY * (ball.vx/vm) * delta;
    ball.y += MAX_VELOCITY * (ball.vy/vm) * delta;

    ball.x = clamp(ball.x, 0, 500);
    ball.y = clamp(ball.y, 0, 500);
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, 10, 0, 2 * Math.PI);
    ctx.stroke();

    stats.innerText = `x: ${ball.x}, y: ${ball.y}, ax: ${ball.ax}, ay: ${ball.ay}, vx: ${ball.vx}, vy: ${ball.vy}`; 

    window.requestAnimationFrame(animate);
}

window.requestAnimationFrame(animate);
window.addEventListener("deviceorientation", (event) => {
    const x = round(event.alpha / 360, 2);
    const y = round(event.beta / 180, 2);
    const z = round(event.gamma / 90, 2);
    
    ball.ax = z;
    ball.ay = y;
    stats.innerText = `ax: ${z}, ay: ${y}`
}, true);