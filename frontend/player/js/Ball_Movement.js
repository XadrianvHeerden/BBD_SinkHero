// JavaScript code for controlling the ball
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('mazeCanvas');
    const ctx = canvas.getContext('2d');

    let ball = { x: canvas.width / 2, y: canvas.height / 2 };
    let velocity = { x: 0, y: 0 };
    let acceleration = { x: 0, y: 0 };
    const friction = 0.9;
    const ballRadius = 10;
    let lastUpdate = Date.now();

    // Update ball position
    function updateBallPosition() {
        // Apply acceleration to velocity
        velocity.x += acceleration.x;
        velocity.y += acceleration.y;

        // Apply friction to velocity
        velocity.x *= friction;
        velocity.y *= friction;

        // Update ball position
        ball.x += velocity.x;
        ball.y += velocity.y;

        // Ensure ball stays within canvas boundaries
        ball.x = Math.max(ballRadius, Math.min(canvas.width - ballRadius, ball.x));
        ball.y = Math.max(ballRadius, Math.min(canvas.height - ballRadius, ball.y));
    }

    // Draw ball
    function drawBall() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = "red";
        ctx.fill();
        ctx.closePath();
    }

    // Animation loop
    function animate() {
        updateBallPosition();
        drawBall();
        requestAnimationFrame(animate);
    }

    // Handle gyroscope data
    window.addEventListener('deviceorientation', (event) => {
        const now = Date.now();

        if (now - lastUpdate > 16) { // Throttle to ~60fps
            // Map gyroscope data to acceleration
            acceleration.x = event.gamma / 100; // Adjust the sensitivity
            acceleration.y = event.beta / 100;  // Adjust the sensitivity

            lastUpdate = now;
        }
    });

    // Start the animation
    requestAnimationFrame(animate);
});
