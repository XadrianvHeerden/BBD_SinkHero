const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let players = [];
let games = [];

app.use(express.static(path.join(__dirname, './../public')));

app.get('/games', (req, res) => {
    const gameList = games.map((game, gameId) => ({
        gameId,
        players: game.map(player => player.name)
    }));
    res.json(gameList);
});

io.on('connection', (socket) => {
    console.log('A player connected:', socket.id);

    // Handle setting the player's name
    socket.on('setName', (data) => {
        socket.name = data.name;
        players.push(socket);

        // Automatically start the game if 4 players join
        if (players.length === 4) {
            startGame();
        } else {
            // Notify the player that they are waiting for more players
            socket.emit('waiting', { playersCount: players.length });
        }
    });

    // Handle starting the game manually
    socket.on('startGame', () => {
        startGame();
    });

    socket.on('disconnect', () => {
        console.log('A player disconnected:', socket.id);

        players = players.filter(player => player.id !== socket.id);

        games.forEach((game, gameId) => {
            let index = game.indexOf(socket);
            if (index !== -1) {
                game.splice(index, 1);
                game.forEach(player => player.emit('playerLeft', { playerId: index }));

                // If only one or no players are left, remove the game
                if (game.length <= 1) {
                    game.forEach(player => player.emit('gameEnded', { gameId: gameId }));
                    games.splice(gameId, 1);
                    console.log(`Game ${gameId} ended due to insufficient players.`);
                }
            }
        });
    });

    const startGame = () => {
        if (players.length >= 2) {
            let gamePlayers = players.splice(0, players.length);
            let gameId = games.length;
            games.push(gamePlayers);

            // Notify players they are in a game
            gamePlayers.forEach((player, index) => {
                player.emit('gameStart', { gameId: gameId, playerId: index, name: player.name });
            });

            console.log(`Game ${gameId} started with players:`, gamePlayers.map(p => p.id + " (" + p.name + ")"));
        }
    };
});

server.listen(3000, () => {
    console.log('Server is listening on port 3000');
});
