document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('mazeCanvas');
    const ctx = canvas.getContext('2d');

    const cellSize = 100;
    const ballRadius = cellSize / 6;
    const endRadius = cellSize / 3;

    let generatedMaze;
    let end;
    let player = { x: 0, y: 0 }; // Player position in cell coordinates

    const cols = Math.floor(canvas.width / cellSize);
    const rows = Math.floor(canvas.height / cellSize);

    let velocity = { x: 0, y: 0 };
    let acceleration = { x: 0, y: 0 };
    const friction = 1; // Adjusted for smoother deceleration
    let lastUpdate = Date.now();

    // Device orientation event handling
    if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', handleOrientation, true);
    } else {
        console.log("Device orientation not supported.");
    }

    function handleOrientation(event) {
        // Normalize and adjust sensitivity based on testing
        const gammaNormalized = event.gamma / 90; // Range [-1, 1]
        const betaNormalized = event.beta / 90;   // Range [-1, 1]

        // Apply filtering to reduce noise and adjust responsiveness
        acceleration.x = gammaNormalized * 0.15;  // Adjust sensitivity for smoother control
        acceleration.y = betaNormalized * 0.15;   // Adjust sensitivity for smoother control
    }

    function clearScreen() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    class Cell {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.visited = false;
            this.walls = {
                top: true,
                right: true,
                bottom: true,
                left: true
            };
        }

        show(offsetX, offsetY) {
            const x = this.x * cellSize + offsetX;
            const y = this.y * cellSize + offsetY;

            ctx.beginPath();
            if (this.walls.top) {
                ctx.moveTo(x, y);
                ctx.lineTo(x + cellSize, y);
            }
            if (this.walls.right) {
                ctx.moveTo(x + cellSize, y);
                ctx.lineTo(x + cellSize, y + cellSize);
            }
            if (this.walls.bottom) {
                ctx.moveTo(x + cellSize, y + cellSize);
                ctx.lineTo(x, y + cellSize);
            }
            if (this.walls.left) {
                ctx.moveTo(x, y + cellSize);
                ctx.lineTo(x, y);
            }
            ctx.strokeStyle = 'blue';
            ctx.lineWidth = 5;
            ctx.lineCap = "round";
            ctx.stroke();
        }
    }

    function mazeGenerator(cols, rows) {
        const grid = [];
        for (let x = 0; x < cols; x++) {
            grid[x] = [];
            for (let y = 0; y < rows; y++) {
                grid[x][y] = new Cell(x, y);
            }
        }

        const stack = [];
        const start = grid[0][0];
        start.visited = true;
        stack.push(start);

        while (stack.length > 0) {
            const current = stack[stack.length - 1];
            const next = getUnvisitedNeighbor(current, grid, cols, rows);

            if (next) {
                next.visited = true;
                stack.push(next);
                removeWalls(current, next);
            } else {
                stack.pop();
            }
        }

        const middleX = Math.floor(cols / 2);
        const middleY = Math.floor(rows / 2);
        end = grid[middleX][middleY];

        return grid;
    }

    function getUnvisitedNeighbor(cell, grid, cols, rows) {
        const neighbors = [];
        const { x, y } = cell;

        if (x > 0 && !grid[x - 1][y].visited) {
            neighbors.push(grid[x - 1][y]);
        }
        if (x < cols - 1 && !grid[x + 1][y].visited) {
            neighbors.push(grid[x + 1][y]);
        }
        if (y > 0 && !grid[x][y - 1].visited) {
            neighbors.push(grid[x][y - 1]);
        }
        if (y < rows - 1 && !grid[x][y + 1].visited) {
            neighbors.push(grid[x][y + 1]);
        }

        if (neighbors.length > 0) {
            const randomIndex = Math.floor(Math.random() * neighbors.length);
            return neighbors[randomIndex];
        } else {
            return undefined;
        }
    }

    function removeWalls(a, b) {
        const x = a.x - b.x;
        const y = a.y - b.y;

        if (x === 1) {
            a.walls.left = false;
            b.walls.right = false;
        } else if (x === -1) {
            a.walls.right = false;
            b.walls.left = false;
        }

        if (y === 1) {
            a.walls.top = false;
            b.walls.bottom = false;
        } else if (y === -1) {
            a.walls.bottom = false;
            b.walls.top = false;
        }
    }

    function setup() {
        generatedMaze = mazeGenerator(cols, rows);
        addOuterBorder();
        assignStartingPosition();
        drawMaze();
        drawEnd(end);
        drawBall();
        requestAnimationFrame(updateBallPosition);
    }

    function addOuterBorder() {
        for (let x = 0; x < cols; x++) {
            generatedMaze[x][0].walls.top = true;
            generatedMaze[x][rows - 1].walls.bottom = true;
        }

        for (let y = 0; y < rows; y++) {
            generatedMaze[0][y].walls.left = true;
            generatedMaze[cols - 1][y].walls.right = true;
        }

        // Randomly choose an entrance side and open the wall
        const entranceSide = Math.floor(Math.random() * 4);
        let entranceCell;

        switch (entranceSide) {
            case 0:
                entranceCell = generatedMaze[Math.floor(Math.random() * cols)][0];
                entranceCell.walls.top = false;
                break;
            case 1:
                entranceCell = generatedMaze[cols - 1][Math.floor(Math.random() * rows)];
                entranceCell.walls.right = false;
                break;
            case 2:
                entranceCell = generatedMaze[Math.floor(Math.random() * cols)][rows - 1];
                entranceCell.walls.bottom = false;
                break;
            case 3:
                entranceCell = generatedMaze[0][Math.floor(Math.random() * rows)];
                entranceCell.walls.left = false;
                break;
        }
    }

    function assignStartingPosition() {
        player.x = 0;
        player.y = 0;
    }

    function drawMaze() {
        clearScreen();
        const offsetX = (canvas.width - cols * cellSize) / 2;
        const offsetY = (canvas.height - rows * cellSize) / 2;

        for (let x = 0; x < cols; x++) {
            for (let y = 0; y < rows; y++) {
                generatedMaze[x][y].show(offsetX, offsetY);
            }
        }
    }

    function drawBall() {
        const offsetX = (canvas.width - cols * cellSize)- cellSize;
        const offsetY = (canvas.height - rows * cellSize) - cellSize;

        const ballPosX = player.x * cellSize + cellSize + offsetX;
        const ballPosY = player.y * cellSize + cellSize + offsetY;

        ctx.beginPath();
        ctx.arc(ballPosX, ballPosY, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = "red";
        ctx.fill();
        ctx.closePath();
    }

    function drawEnd(end) {
        const offsetX = (canvas.width - cols * cellSize) / 2;
        const offsetY = (canvas.height - rows * cellSize) / 2;

        const endPosX = end.x * cellSize + cellSize / 2 + offsetX;
        const endPosY = end.y * cellSize + cellSize / 2 + offsetY;

        ctx.beginPath();
        ctx.arc(endPosX, endPosY, endRadius, 0, Math.PI * 2);
        ctx.fillStyle = 'gold';
        ctx.fill();
        ctx.closePath();
    }

    function resetPlayerPos() {
        player.x = 0;
        player.y = 0;
    }

    function checkCollisions(newX, newY) {
        // Convert the new position to cell coordinates
        const cellX = Math.floor(newX);
        const cellY = Math.floor(newY);

        // Ensure the new coordinates are within the maze bounds
        if (newX < 0 || newX >= cols || newY < 0 || newY >= rows) {
            return { newX: player.x, newY: player.y };
        }

        // Check if moving right into a wall
        if (velocity.x > 0) {
            if (generatedMaze[cellX][cellY].walls.right && (newX + ballRadius / cellSize) > (cellX + 1)) {
                newX = cellX + 1 - ballRadius / cellSize;
                velocity.x = 0;
            }
        }

        // Check if moving left into a wall
        if (velocity.x < 0) {
            if (generatedMaze[cellX][cellY].walls.left && (newX - ballRadius / cellSize) < cellX) {
                newX = cellX + ballRadius / cellSize;
                velocity.x = 0;
            }
        }

        // Check if moving down into a wall
        if (velocity.y > 0) {
            if (generatedMaze[cellX][cellY].walls.bottom && (newY + ballRadius / cellSize) > (cellY + 1)) {
                newY = cellY + 1 - ballRadius / cellSize;
                velocity.y = 0;
            }
        }

        // Check if moving up into a wall
        if (velocity.y < 0) {
            if (generatedMaze[cellX][cellY].walls.top && (newY - ballRadius / cellSize) < cellY) {
                newY = cellY + ballRadius / cellSize;
                velocity.y = 0;
            }
        }

        return { newX, newY };
    }

    function updateBallPosition() {
        const now = Date.now();
        const deltaTime = (now - lastUpdate) / 1000; // Time in seconds
        lastUpdate = now;

        velocity.x += acceleration.x * deltaTime;
        velocity.y += acceleration.y * deltaTime;

        velocity.x *= friction;
        velocity.y *= friction;

        let newX = player.x + velocity.x;
        let newY = player.y + velocity.y;

        const correctedPosition = checkCollisions(newX, newY);
        newX = correctedPosition.newX;
        newY = correctedPosition.newY;

        player.x = newX;
        player.y = newY;

        if (Math.abs(player.x - end.x) <= 0.2 && Math.abs(player.y - end.y) <= 0.2) {
            alert("Congratulations! You've reached the end!");
            // resetPlayerPos();
        }

        drawMaze();
        drawEnd(end);
        drawBall();

        requestAnimationFrame(updateBallPosition);
    }

    setup();
});
