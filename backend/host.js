const mazeGen = require('./maze_generation');

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let hosts = [];
let games = [];

let start = Date.now();

app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './../public', 'index.html'));
});

app.get('/games', (req, res) => {
    const gameList = Object.keys(games).map((gameId) => ({
        gameId,
        players: games[gameId].players.map(player => ({ name: player.name, points: player.points })),
        currentRound: games[gameId].currentRound,
        status: games[gameId].status
    }));
    res.json(gameList);
});

app.get('/host', (req, res) => {
    res.sendFile(path.join(__dirname, './../public', 'host.html'));
    io.emit('hostAccessed');
});

io.on('connection', (socket) => {
    console.log('A player connected:', socket.id);

    socket.on("hostConnected", (data) => {
        hosts.push(socket);
        console.log(hosts);
    });

    socket.on('joinGame', (data) => {
        const { gameId, username } = data;
        
        if (!games[gameId]) {
            games[gameId] = { players: [], currentRound: 0, status: 'waiting' };
        }

        if (games[gameId].status !== 'waiting') {
            socket.emit('error', { message: 'Game already started. You cannot join.' });
            return;
        }

        if (games[gameId].players.find(player => player.name === username)) {
            socket.emit('error', { message: 'Username already taken in this game.' });
            return;
        }

        socket.name = username;
        socket.points = 0;
        socket.currentRound = 0;
        socket.gameId = gameId;

        games[gameId].players.push(socket);

        // Notify all players in the game about the current waiting status
        games[gameId].players.forEach(player => player.emit('waiting', { playersCount: games[gameId].players.length }));

        if (games[gameId].players.length === 4) {
            startGame(gameId);
        }
    });

    socket.on('startGame', () => {
        // start = Date.now();

        startGame(socket.gameId);
    });

    socket.on('disconnect', () => {
        console.log('A player disconnected:', socket.id);

        const gameId = socket.gameId;
        if (!gameId) return;

        // games[gameId].players = games[gameId].players.filter(player => player.id !== socket.id);

        // Notify all players in the game about the current waiting status
        games[gameId].players.forEach(player => player.emit('waiting', { playersCount: games[gameId].players.length }));

        if (games[gameId].players.length <= 1) {
            games[gameId].players.forEach(player => player.emit('gameEnded', { gameId }));
            delete games[gameId];
            console.log(`Game ${gameId} ended due to insufficient players.`);
        } else {
            games[gameId].players.forEach(player => player.emit('playerLeft', { playerId: socket.id }));
        }
    });

    const startGame = (gameId) => {
        let generatedMaze = mazeGen.GenerateMaze(780, 600);

        games[socket.gameId].players.concat(hosts).forEach(player => {
            player.emit('sendMaze', generatedMaze);
        });

        if (games[gameId].players.length >= 2) {
            games[gameId].status = 'in-progress';
            games[gameId].currentRound = 0;

            let colours = ["#ff0000", "#ffff00", "#ff00ff", "#0000ff"];
            let startPositions = [ {x: 30, y: 30}, {x:750, y:30}, {x:30, y:570}, {x:750, y:570}];

            games[gameId].players.forEach((player, index) => {
                player.emit('gameStart', { gameId, playerId: index, name: player.name , x: startPositions[index].x / 60, y: startPositions[index].y / 60, colour: colours[index] });
                player.join(gameId); // Join a room with the gameId
            });

            console.log(`Game ${gameId} started with players:`, games[gameId].players.map(p => p.id + " (" + p.name + ")"));

            // Start the first round
            startRound(gameId);
        }
        else{
            endGame(gameId);
        }
    };

    const startRound = (gameId) => {
        const game = games[gameId];
        game.currentRound++;

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

        delete games[gameId];
        console.log(`Game ${gameId} ended. Winner: ${winner.name} with ${winner.points} points.`);
    };

    socket.on('endRound', (data) => {
        console.log(data);
        games[socket.gameId].players.forEach(player => player.emit('getPositions', {  playerId: socket.id  }));
    });

    socket.on('receivePositions', (data) => {
        console.log(data);

        const game = games[data.gameId];
        const positions = data.positions;

        if (positions) {
            positions.forEach((positionData) => {
                const player = game.players.find(p => p.id === socket.id);
                if (player) { // Check if player exists
                    player.points += (4 - positionData.position) * 100;

                    // Notify all players of the updated points
                    game.players.forEach(p => {
                        
                    });
                        p.emit('pointsUpdated', { playerId: positionData.playerId, points: player.points });
                } else {
                    console.error(`Player with ID ${positionData.playerId} not found`);
                }
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

    socket.on("playerPositionChanged", (data) => {
        const game = games[data.gameId]; 

        if (!game)
            return;

        game.players.forEach(player => {
            if (player != socket) {
                player.emit("playerPositionChangedHost", data);
            }
        });

        hosts.forEach(host => {
            host.emit("playerPositionChangedHost", data);
        })
    });

    socket.on('declareWinner', (data) => {
        let game = games[socket.gameId];

        if (!game)
            return;

        if (!game.winners) {
            game.winners = [];
        }
        // let now = Date.now();

        game.winners.push(data);

        if (game.winners.length == game.players.length) {
            hosts.forEach(host => host.emit('gameOver', {}))
        }

        data.place = game.winners.length;
        data.time = (5 - data.place) * 100 + Math.floor(Math.random() * 20);

        game.players.concat(hosts).forEach(player => {
            player.emit('addWinner', data);
        });
    })

    socket.on('restart', (data) => {
        let game = games[socket.gameId];

        if (!game)
            return;

        game.players.concat(hosts).forEach(player => {
            player.emit('reload', {});
        });
    });
});

server.listen(3000, () => {
    console.log('Server is listening on port 3000');
});
