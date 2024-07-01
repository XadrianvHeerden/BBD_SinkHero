import { Vector2 } from "./physics.js";
import { clamp, round } from "./utils.js";

const MAX_VELOCITY = 300;
const MAX_ACCELARATION = 1000;

let ball = { radius: 10, position: new Vector2(), velocity: new Vector2(), acceleration: new Vector2() }
let previousTimeStamp = 0;

const FRICTION = 0.8;

// for debugging
let stats = document.getElementById("stats");

function animate(timeStamp) {
    let canvas = document.getElementById("maze");
    let ctx = canvas.getContext("2d");

    ctx.clearRect(ball.position.x - ball.radius - 1, ball.position.y - ball.radius - 1, (ball.radius + 1) * 2, (ball.radius + 1) * 2);

    const delta = (timeStamp - previousTimeStamp) / 1000.0;
    
    ball.velocity.scale(FRICTION);

    ball.velocity.x += ball.acceleration.x * MAX_ACCELARATION * delta;
    ball.velocity.y += ball.acceleration.y * MAX_ACCELARATION * delta;

    ball.velocity.clamp(new Vector2(-MAX_VELOCITY), new Vector2(MAX_VELOCITY));

    let velocity = ball.velocity.getDirection();
    
    ball.position.x += MAX_VELOCITY * velocity.x * delta;
    ball.position.y += MAX_VELOCITY * velocity.y * delta;

    ball.position.clamp(new Vector2(), new Vector2(500));
    
    ctx.beginPath();
    ctx.arc(ball.position.x, ball.position.y, ball.radius, 0, 2 * Math.PI);
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