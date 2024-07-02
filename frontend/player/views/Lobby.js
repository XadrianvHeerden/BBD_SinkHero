// Initialize WebSocket connection
const socket = new WebSocket('ws://localhost:5500');

// Event listener for WebSocket connection established
socket.addEventListener('open', (event) => {
    console.log('Connected to the server.');
});

// Event listener for incoming messages from the server
socket.addEventListener('message', (event) => {
    const data = JSON.parse(event.data);
    console.log('Message from server:', data);

    // Handle server responses
    if (data.message) {
        alert(data.message); // Show alerts for messages from server
    } else if (data.gameId && data.username) {
        // Redirect to waiting page with gameId and username
        window.location.href = `waiting.html?gameId=${data.gameId}&username=${data.username}`;
    }
});

// Event listener for WebSocket connection closed
socket.addEventListener('close', (event) => {
    console.log('Disconnected from the server.');
});

// Event listener for WebSocket errors
socket.addEventListener('error', (event) => {
    console.error('WebSocket error observed:', event);
});

// Function to create a game
function createGame() {
    /*const gameName = document.getElementById('gameNameInput').value;
    //const username = document.getElementById('usernameInput').value;

    if (!gameName || !username) {
        alert('Please enter a game name and username.');
        return;
    }

    // Check if WebSocket connection is open
    if (socket.readyState === WebSocket.OPEN) {
        const payload = {
            action: 'create',
            gameName: gameName,
            username: username
        };
        socket.send(JSON.stringify(payload));
    } else {
        console.error('WebSocket is not open. Unable to send message.');
    }*/
   // Redirect to another view
   window.location.href = '/BBD_SinkHero/frontend/player/views/Game_Start_Lobby.html'; // Replace with your actual waiting page URL
}

// Function to join a game
function joinGame() {
    const gameId = document.getElementById('gameIdInput').value;
    const username = document.getElementById('usernameInput').value;

    if (!gameId || !username) {
        alert('Please enter a game ID and username.');
        return;
    }

    // Check if WebSocket connection is open
    if (socket.readyState === WebSocket.OPEN) {
        const payload = {
            action: 'join',
            gameId: gameId,
            username: username
        };
        socket.send(JSON.stringify(payload));
    } else {
        console.error('WebSocket is not open. Unable to send message.');
    }
}

///Funtions for the game start Waiting Lobby
function StartGame() {
    
}
