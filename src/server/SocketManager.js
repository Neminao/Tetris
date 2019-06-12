const io = require('./server.js').io;

const { GAME_OVER, INITIALIZE_GAME, DISPLAY_GAMES, VERIFY_USER, USER_CONNECTED, LOGOUT, GAME_UPDATE, USER_DISCONNECTED, GAME_START, USER_READY, GAME_INIT, USER_IN_GAME, GAME_REQUEST, REQUEST_DENIED, RESET, ADD_SHAPES, SPECTATE, SEND_TO_SPECTATOR, SPECTATE_INFO } = require('../Events.js')

const { createUser, generateShapes } = require('../factories')

let connectedUsers = {}

let gamesInProgress = {};

module.exports = function (socket) {
    console.log(socket.id);
    socket.on(VERIFY_USER, (nickname, callback) => {
        if (isUser(connectedUsers, nickname)) {
            callback({ isUser: true, user: null })
        }
        else {
            callback({ isUser: false, user: createUser({ name: nickname, socketID: socket.id }) })
        }
    })
    socket.on('disconnect', () => {
        if ("user" in socket) {
            let name = socket.user.name;
            console.log("name: " + name)
            connectedUsers = removeUser(connectedUsers, socket.user.name);
            gamesInProgress = removeGame(gamesInProgress, name);
            io.emit(USER_DISCONNECTED, { allUsers: connectedUsers, name });
            if (gamesInProgress) {
                io.emit(DISPLAY_GAMES, gamesInProgress)
            }
        }
    })

    socket.on(USER_CONNECTED, (user) => {
        user.socketID = socket.id;
        connectedUsers = addUser(connectedUsers, user);

        socket.user = user;
        io.emit(USER_CONNECTED, connectedUsers);
        if (gamesInProgress) {
            io.emit(DISPLAY_GAMES, gamesInProgress);
        }
        console.log(connectedUsers);
    })
    socket.on(GAME_UPDATE, ({ matrix, shape, reciever, sender, score, totalScore, acceleration }) => {
        emitToAllRecievers({ matrix: matrix, shape: shape, score, totalScore, acceleration, sender }, GAME_UPDATE, reciever, socket);
    })
    socket.on(LOGOUT, () => {
        let name = socket.user.name;
        console.log(name)
        connectedUsers = removeUser(connectedUsers, socket.user.name);
        gamesInProgress = removeGame(gamesInProgress, name);
        io.emit(USER_DISCONNECTED, { allUsers: connectedUsers, name });
        if (gamesInProgress) {
            io.emit(DISPLAY_GAMES, gamesInProgress);
        }
    })

    socket.on(GAME_INIT, () => {
        socket.emit(GAME_INIT, generateShapes(1000));
    })

    socket.on(RESET, ({ to, user }) => {
        let rec;
        let current = connectedUsers[user];
        if (current)
            current.inGame = false;
        if (to)
            to.forEach(name => {
                rec = connectedUsers[name];
                if(rec)
                socket.to(rec.socketID).emit(RESET, user);
            })
        io.emit(USER_CONNECTED, connectedUsers);
    })

    socket.on(USER_READY, ({ user, reqSender }) => {
        const senderID = connectedUsers[reqSender].socketID;
        socket.to(senderID).emit(USER_READY, user);
        console.log('Invited by: ' + reqSender + ", User: " + user); 
    })

    socket.on(REQUEST_DENIED, ({ user, reqSender }) => {
        const senderID = connectedUsers[reqSender].socketID;
        socket.to(senderID).emit(REQUEST_DENIED, user);
    })

    socket.on(INITIALIZE_GAME, ({ sender, recievers }) => {
        let rec;
        const generatedShapes = generateShapes(1000);
        let tempArray;
        gamesInProgress = addGame(gamesInProgress, sender, recievers);
        for (var i = 0; i < recievers.length; i++) {
            rec = connectedUsers[recievers[i]];
            if (rec) {
                tempArray = recievers.slice(0);
                tempArray.splice(i, 1);
                tempArray.push(sender);
                rec.inGame = true;
                socket.to(rec.socketID).emit(INITIALIZE_GAME, { generatedShapes, recievers: tempArray });
            }
        }
        let s = connectedUsers[sender];
        s.inGame = true;
        socket.emit(INITIALIZE_GAME, { generatedShapes, recievers });
        io.emit(USER_CONNECTED, connectedUsers);
    })

    socket.on(GAME_START, ({ to, user }) => {
        let rec;
        socket.emit(GAME_START, { start: true });
        if (to) {
            to.forEach(name => {
                rec = connectedUsers[name];
                if (rec)
                    socket.to(rec.socketID).emit(GAME_START, { start: true });
            })

        }
        if (gamesInProgress) {
            io.emit(DISPLAY_GAMES, gamesInProgress);
        }
    })

    socket.on(USER_IN_GAME, ({ username }) => {
        connectedUsers[username].inGame = true;
        io.emit(USER_CONNECTED, connectedUsers);
    })

    socket.on(GAME_REQUEST, ({ sender, reciever }) => {
        let rec;
        for (var i = 0; i < reciever.length; i++) {
            rec = connectedUsers[reciever[i]];
            socket.to(rec.socketID).emit(GAME_REQUEST, { sender });
        }
    })

    socket.on(ADD_SHAPES, (reciever) => {
        const newShapes = generateShapes(100);
        socket.emit(ADD_SHAPES, newShapes);
        reciever.forEach(name => {
            socket.to(connectedUsers[name].socketID).emit(ADD_SHAPES, newShapes);
        })
    })


    socket.on(SPECTATE, ({ user, game }) => {
        let gameToSpectate = gamesInProgress[game];
        let u1;
        if (gameToSpectate)
            u1 = connectedUsers[gameToSpectate.sender];
        let un;
        if (u1)
            socket.to(u1.socketID).emit(SPECTATE, user);
        gameToSpectate.recievers.forEach(name => {
            un = connectedUsers[name];
            if (un)
                socket.to(un.socketID).emit(SPECTATE, user);
        })
        let recievers = gameToSpectate.recievers;
        recievers.push(game);
        socket.emit(SPECTATE_INFO, recievers);

    })
    socket.on(SEND_TO_SPECTATOR, ({ matrix, shape, spectator, user, totalScore, score }) => {

        const specID = connectedUsers[spectator];
        if (specID)
            socket.to(specID.socketID).emit(SEND_TO_SPECTATOR, { matrix, shape, user, totalScore, score });
    })

    socket.on(GAME_OVER, ({user, recievers}) => {
        let reciever;
        recievers.forEach(name => {
            reciever = connectedUsers[name]
            if(reciever){
                socket.to(reciever.socketID).emit(GAME_OVER, user);
            }
        })
    })
}

function emitToAllRecievers(data, emitType, recievers, socket) {
    let rec;
    if (recievers)
        recievers.forEach(name => {
            rec = connectedUsers[name];
            if (rec)
                if (rec.inGame) {
                    socket.to(rec.socketID).emit(emitType, data);
                }
        })
}
function isUser(userList, username) {
    return username in userList;
}

function addUser(userList, user) {
    let newList = Object.assign({}, userList);
    newList[user.name] = user;
    return newList;
}
function removeUser(userList, username) {
    let newList = Object.assign({}, userList);
    delete newList[username];
    return newList;
}
function addGame(userList, sender, recievers) {
    let newList = Object.assign({}, userList);
    newList[sender] = { sender, recievers };
    return newList;
}
function removeGame(userList, sender) {
    let newList = Object.assign({}, userList);
    delete newList[sender];
    return newList;
}

