const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let players = [];
let games = [];

io.on('connection', (socket) => {
    console.log('A player connected:', socket.id);

    // Add player to the players array
    players.push(socket);

    // Check if we have enough players to start a game
    if (players.length === 4) {
        let game = players.splice(0, 4);
        let gameId = games.length;
        games.push(game);

        // Notify players they are in a game
        game.forEach((player, index) => {
            player.emit('gameStart', { gameId: gameId, playerId: index });
        });

        console.log(`Game ${gameId} started with players:`, game.map(p => p.id));
    }

    socket.on('disconnect', () => {
        console.log('A player disconnected:', socket.id);

        // Remove player from the players array
        players = players.filter(player => player.id !== socket.id);

        // Remove player from any game they were in
        games.forEach(game => {
            let index = game.indexOf(socket);
            if (index !== -1) {
                game.splice(index, 1);
                // Notify other players in the game
                game.forEach(player => player.emit('playerLeft', { playerId: index }));
            }
        });
    });
});

server.listen(3000, () => {
    console.log('Server is listening on port 3000');
});