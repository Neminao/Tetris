const io = require('./server.js').io;

const { VERIFY_USER, USER_CONNECTED, LOGOUT, GAME_UPDATE, USER_DISCONNECTED, GAME_START, USER_READY, GAME_INIT, USER_IN_GAME, GAME_REQUEST, REQUEST_DENIED, RESET, ADD_SHAPES } = require('../Events.js')

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
            connectedUsers = removeUser(connectedUsers, socket.user.name);

            io.emit(USER_DISCONNECTED, connectedUsers);
        }
    })

    socket.on(USER_CONNECTED, (user) => {
        user.socketID = socket.id;
        connectedUsers = addUser(connectedUsers, user);

        socket.user = user;
        io.emit(USER_CONNECTED, connectedUsers);
        console.log(connectedUsers);
    })
    socket.on(GAME_UPDATE, ({ matrix, shape, reciever, sender, score, totalScore, acceleration }) => {
        let pom = true;
        reciever.forEach(name => {
            if (!(name in connectedUsers)) {
                pom = false;
            }
        });
        if (pom) {
            emitToAllRecievers({ matrix: matrix, shape: shape, score, totalScore, acceleration, sender }, GAME_UPDATE, reciever, socket);
            /*      reciever.forEach(name => {
                  rec = connectedUsers[name];
                  if(rec.inGame){
                  socket.to(rec.socketID).emit(GAME_UPDATE, { matrix: matrix, shape: shape, score, totalScore, acceleration });
                  }
              })*/
        }
    })
    socket.on(LOGOUT, () => {
        connectedUsers = removeUser(connectedUsers, socket.user.name);
        io.emit(USER_DISCONNECTED, connectedUsers);
        console.log("Disconnect", connectedUsers);
    })

    socket.on(GAME_INIT, () => {
        socket.emit(GAME_INIT, generateShapes(1000));
    })

    socket.on(RESET, ({ to, user }) => {
        let rec;
        let current = connectedUsers[user];
        current.inGame = false;
        if (to)
            to.forEach(name => {
                rec = connectedUsers[name];
                socket.to(rec.socketID).emit(RESET);
            })
        io.emit(USER_CONNECTED, connectedUsers);
    })

    socket.on(USER_READY, ({ to, user }) => {
        let pom = true;
        to.forEach(name => {
            if (!(name in connectedUsers)) {
                pom = false
            }
        });

        let pom2 = true; 
        to.forEach(name => {
            if (!connectedUsers[name]) {
                pom2 = false
            }
        }); 
        if (pom) {
            let recSocket;
            let tempArray = []
            let current = connectedUsers[user];
            if (!current.inGame && pom2) {
                const generatedShapes = generateShapes(1000);
                current.inGame = true;
                to.forEach(name => {
                    tempArray = {...to}
                    recSocket = connectedUsers[name];
                    recSocket.inGame = true;
                    tempArray.splice(to.indexOf(name), 1);
                    tempArray.push(user);
                    socket.to(recSocket.socketID).emit(USER_READY, { generatedShapes, reciever: tempArray }); 
                })
                io.emit(USER_CONNECTED, connectedUsers);
                socket.emit(USER_READY, { generatedShapes, reciever: to });
            }
            else {
                const denied = true;
                socket.emit(REQUEST_DENIED, denied);
            }
        }
    })

    socket.on(GAME_START, ({ to, user }) => {
        let rec;
        socket.emit(GAME_START, { start: true });
        if (to) {
         to.forEach(name => {
            rec = connectedUsers[name];
            socket.to(rec.socketID).emit(GAME_START, { start: true });
         })
            
       }
    })

    socket.on(USER_IN_GAME, ({ username }) => {
        connectedUsers[username].inGame = true;
        io.emit(USER_CONNECTED, connectedUsers);
    })
    socket.on(GAME_REQUEST, ({ sender, reciever }) => {
        let rec;
        const generatedShapes = generateShapes(1000);
        let tempArray;
        for(var i = 0;i<reciever.length;i++){
            rec = connectedUsers[reciever[i]];
            tempArray = reciever.slice(0);
                 //   rec.inGame = true; 
                    tempArray.splice(i, 1); 
                    tempArray.push(sender); 
            
            socket.to(rec.socketID).emit(GAME_REQUEST, { sender });
            socket.to(rec.socketID).emit(USER_READY, { generatedShapes, reciever: tempArray }); 
         }
        
            socket.emit(USER_READY, { generatedShapes, reciever}); 
      //  socket.to(rec.socketID).emit(GAME_REQUEST, { sender });
    })

    socket.on(ADD_SHAPES, (reciever) => {
        const newShapes = generateShapes(100);
        socket.emit(ADD_SHAPES, newShapes);
        reciever.forEach(name => {
            socket.to(connectedUsers[name].socketID).emit(ADD_SHAPES, newShapes);
         })
       // socket.to(connectedUsers[reciever].socketID).emit(ADD_SHAPES, newShapes);
    })
}

function emitToAllRecievers(data, emitType, recievers, socket) {
    let rec
    recievers.forEach(name => {
        rec = connectedUsers[name];
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

function addGame(gameList, playerOne, playerTwo) {
    let newList = Object.assign({}, gameList);
    delete newList[playerOne + ' ' + playerTwo];
    return newList;
}

function removeGame(userList, gameID) {
    let newList = Object.assign({}, userList);
    delete newList[gameID];
    return newList;
}
