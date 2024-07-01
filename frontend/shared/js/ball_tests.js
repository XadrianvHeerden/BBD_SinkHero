import { Vector2 } from "./physics.js";
import { clamp, round } from "./utils.js";

const MAX_VELOCITY = 300;
const MAX_ACCELARATION = 5;

let ball = { radius: 10, position: new Vector2(), velocity: new Vector2(), acceleration: new Vector2() }
let previousTimeStamp = 0;

const FRICTION = 0.8;

// for debugging
let stats = document.getElementById("stats");

function animate(timeStamp) {
    let canvas = document.getElementById("maze");
    let ctx = canvas.getContext("2d");

    ctx.clearRect(
        ball.position.x - ball.radius - 1,
        ball.position.y - ball.radius - 1,
        (ball.radius + 1) * 2, (ball.radius + 1) * 2);

    const delta = (timeStamp - previousTimeStamp) / 1000.0;

    ball.velocity.add(ball.acceleration);
    ball.velocity.scale(MAX_ACCELARATION * delta);

    ball.velocity.lerp(Vector2.ZERO, FRICTION);

    ball.velocity.clamp(new Vector2(-MAX_VELOCITY), new Vector2(MAX_VELOCITY));

    let velocity = ball.velocity.getDirection();
    velocity.scale(MAX_VELOCITY * delta);
    
    ball.position.add(velocity);
    ball.position.clamp(Vector2.ZERO, new Vector2(500));
    
    ctx.beginPath();
    ctx.arc(ball.position.x, ball.position.y, ball.radius, 0, 2 * Math.PI);
    ctx.stroke();

    stats.innerText = `x: ${round(ball.position.x, 2)}, y: ${round(ball.position.y, 2)}, ax: ${round(ball.acceleration.x, 2)}, ay: ${round(ball.acceleration.y, 2)}, vx: ${round(ball.velocity.x, 2)}, vy: ${round(ball.velocity.y, 2)}`; 

    previousTimeStamp = timeStamp;
    window.requestAnimationFrame(animate);
}

window.requestAnimationFrame(animate);
window.addEventListener("deviceorientation", (event) => {
    const y = round(event.beta / 180, 2);
    const z = round(event.gamma / 90, 2);
    
    ball.acceleration.x = z;
    ball.acceleration.y = y;
    // stats.innerText = `acceleration.x: ${z}, acceleration.y: ${y}`
}, true);