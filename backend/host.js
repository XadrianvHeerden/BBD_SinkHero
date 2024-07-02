const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let players = [];
let games = [];

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './../public', 'index.html'));
});

app.get('/games', (req, res) => {
    const gameList = games.map((game, gameId) => ({
        gameId,
        players: game.players.map(player => ({ name: player.name, points: player.points })),
        currentRound: game.currentRound
    }));
    res.json(gameList);
});

app.get('/host', (req, res) => {
    res.sendFile(path.join(__dirname, './../public', 'host.html'));
});

io.on('connection', (socket) => {
    console.log('A player connected:', socket.id);

    socket.on('setName', (data) => {
        socket.name = data.name;
        socket.points = 0;
        socket.currentRound = 0;
        players.push(socket);

        // Notify all players about the current waiting status
        io.emit('waiting', { playersCount: players.length });

        if (players.length === 4) {
            startGame();
        }
    });

    socket.on('startGame', () => {
        startGame();
    });

    socket.on('disconnect', () => {
        console.log('A player disconnected:', socket.id);

        players = players.filter(player => player.id !== socket.id);

        // Notify all players about the current waiting status
        io.emit('waiting', { playersCount: players.length });

        games.forEach((game, gameId) => {
            let index = game.players.indexOf(socket);
            if (index !== -1) {
                game.players.splice(index, 1);
                game.players.forEach(player => player.emit('playerLeft', { playerId: index }));

                // If only one or no players are left, remove the game
                if (game.players.length <= 1) {
                    game.players.forEach(player => player.emit('gameEnded', { gameId: gameId }));
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
            games.push({ players: gamePlayers, currentRound: 0 });

            gamePlayers.forEach((player, index) => {
                player.emit('gameStart', { gameId: gameId, playerId: index, name: player.name });
            });

            console.log(`Game ${gameId} started with players:`, gamePlayers.map(p => p.id + " (" + p.name + ")"));

            // Start the first round
            startRound(gameId);
        }
    };

    const startRound = (gameId) => {
        const game = games[gameId];
        game.currentRound++;
        
        // Check if the game should end
        if (game.currentRound > 4) {
            endGame(gameId);
        } else {
            // Notify players of the new round
            game.players.forEach(player => {
                player.emit('newRound', { round: game.currentRound });
            });
        }
    };

    const endGame = (gameId) => {
        const game = games[gameId];
        const winner = game.players.reduce((prev, current) => (prev.points > current.points) ? prev : current);

        game.players.forEach(player => {
            player.emit('gameEnded', { winner: winner.name, points: winner.points });
        });

        games.splice(gameId, 1);
        console.log(`Game ${gameId} ended. Winner: ${winner.name} with ${winner.points} points.`);
    };

    socket.on('endRound', (data) => {
        const game = games[data.gameId];
        const positions = data.positions;

        game.players.forEach(p => {
            p.emit('updatePoints', { playerId: positionData.playerId, points: player.points });
        });

        if (positions) {
            positions.forEach((positionData, index) => {
                const player = game.players[positionData.playerId];
                player.points += positionData.points;

                // Notify all players of the updated points
                game.players.forEach(p => {
                    p.emit('pointsUpdated', { playerId: positionData.playerId, points: player.points });
                });
            });

            // Start the next round
            // startRound(data.gameId);
        } else {
            console.error('Positions data is missing in endRound event');
        }
    });

    socket.on('nextRound', (data) => {
        // Start the next round
        startRound(data.gameId);
    });
});

server.listen(3000, () => {
    console.log('Server is listening on port 3000');
});
