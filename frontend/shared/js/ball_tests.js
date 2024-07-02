import { Vector2 } from "./physics.js";
import { clamp, round } from "./utils.js";

const MAX_VELOCITY = 300;
const MAX_ACCELARATION = 10;

let ball = { radius: 10, position: new Vector2(), velocity: new Vector2(), acceleration: new Vector2() }
let previousTimeStamp = performance.now();

const FRICTION = 0.8;

// for debugging
let stats = document.getElementById("stats");
const FRAME_RATE = 60;

function update(timeStamp) {
    let canvas = document.getElementById("maze");
    let ctx = canvas.getContext("2d");

    ctx.clearRect(
        ball.position.x - ball.radius - 1,
        ball.position.y - ball.radius - 1,
        (ball.radius + 1) * 2, (ball.radius + 1) * 2);

    const delta = (timeStamp - previousTimeStamp) / (1000.0 / FRAME_RATE);
    ball.acceleration.scale(MAX_ACCELARATION);
    ball.velocity.add(ball.acceleration);
    ball.velocity.clamp(new Vector2(-MAX_VELOCITY), new Vector2(MAX_VELOCITY));
    ball.velocity.scale(FRICTION);

    let velocity = ball.velocity.getDirection();
    velocity.scale(MAX_VELOCITY * delta);
    
    ball.position.add(velocity);
    ball.position.clamp(Vector2.ZERO, new Vector2(500));
    
    ctx.beginPath();
    ctx.arc(ball.position.x, ball.position.y, ball.radius, 0, 2 * Math.PI);
    ctx.fillStyle = 'cornflowerblue';
    ctx.fill();

    stats.innerText = `x: ${round(ball.position.x, 2)}, y: ${round(ball.position.y, 2)}, ax: ${round(ball.acceleration.x, 2)}, ay: ${round(ball.acceleration.y, 2)}, vx: ${round(ball.velocity.x, 2)}, vy: ${round(ball.velocity.y, 2)}`; 

    previousTimeStamp = timeStamp;
    requestAnimationFrame(update);
}

addEventListener("deviceorientation", (event) => {
    const y = round(event.beta / 180, 2);
    const z = round(event.gamma / 90, 2);
    
    ball.acceleration.set(z, y);
    stats.innerText = `acceleration.x: ${z}, acceleration.y: ${y}`
    requestAnimationFrame(update);
}, true);