import { Vector2 } from "./physics.js";
import { clamp, round } from "./utils.js";

const MAX_VELOCITY = 300;
const MAX_ACCELARATION = 1000;

let ball = { position: new Vector2(), velocity: new Vector2(), acceleration: new Vector2() }
let previousTimeStamp = 0;

// for debugging
let stats = document.getElementById("stats");

function animate(timeStamp) {
    let canvas = document.getElementById("maze");
    let ctx = canvas.getContext("2d");

    ctx.clearRect(ball.position.x - 12, ball.position.y - 12, 24, 24);

    const delta = (timeStamp - previousTimeStamp) / 1000.0;
    
    ball.velocity.x += ball.acceleration.x * MAX_ACCELARATION * delta;
    ball.velocity.y += ball.acceleration.y * MAX_ACCELARATION * delta;

    ball.velocity.x = clamp(ball.velocity.x, -MAX_VELOCITY, MAX_VELOCITY);
    ball.velocity.y = clamp(ball.velocity.y, -MAX_VELOCITY, MAX_VELOCITY);
    
    let magnitude = Math.sqrt(ball.velocity.x * ball.velocity.x + ball.velocity.y * ball.velocity.y);

    if (magnitude !== 0) {
        ball.position.x += MAX_VELOCITY * (ball.velocity.x / magnitude) * delta;
        ball.position.y += MAX_VELOCITY * (ball.velocity.y / magnitude) * delta;
    }

    ball.position.x = clamp(ball.position.x, 0, 500);
    ball.position.y = clamp(ball.position.y, 0, 500);
    
    ctx.beginPath();
    ctx.arc(ball.position.x, ball.position.y, 10, 0, 2 * Math.PI);
    ctx.stroke();

    stats.innerText = `x: ${ball.position.x}, y: ${ball.position.y}, acceleration.x: ${ball.acceleration.x}, acceleration.y: ${ball.acceleration.y}, velocity.x: ${ball.velocity.x}, velocity.y: ${ball.velocity.y}`; 

    previousTimeStamp = timeStamp;
    window.requestAnimationFrame(animate);
}

window.requestAnimationFrame(animate);
window.addEventListener("deviceorientation", (event) => {
    const x = round(event.alpha / 360, 2);
    const y = round(event.beta / 180, 2);
    const z = round(event.gamma / 90, 2);
    
    ball.acceleration.x = z;
    ball.acceleration.y = y;
    // stats.innerText = `acceleration.x: ${z}, acceleration.y: ${y}`
}, true);