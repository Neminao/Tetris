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
        if (reciever in connectedUsers) {
            const recSocket = connectedUsers[reciever];
            if(recSocket.inGame){
            socket.to(recSocket.socketID).emit(GAME_UPDATE, { matrix: matrix, shape: shape, score, totalScore, acceleration });
            }
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
    socket.on(RESET, ({to, user})=> {
        let rec = connectedUsers[to];
        let current = connectedUsers[user];
        current.inGame = false;
        if(rec){
            socket.to(rec.socketID).emit(RESET);
            io.emit(USER_CONNECTED, connectedUsers);
        }
    })
    socket.on(USER_READY, ({to, user})=>{
        if (to in connectedUsers) {
            let recSocket = connectedUsers[to];
            let current = connectedUsers[user];
            if(!current.inGame && !recSocket.inGame){
            recSocket.inGame = true;
            current.inGame = true;
            const generatedShapes = generateShapes(1000);
            io.emit(USER_CONNECTED, connectedUsers);
            socket.to(recSocket.socketID).emit(USER_READY, {generatedShapes, reciever: user});
            socket.emit(USER_READY, {generatedShapes, reciever: to});
        }
    else {
        const denied= true;
        socket.emit(REQUEST_DENIED, denied);
    }}
    })
    
    socket.on(GAME_START, ({to, user}) => {
        const rec = connectedUsers[to];
            socket.emit(GAME_START, {start: true});
            if(to && rec && rec.inGame){
            socket.to(rec.socketID).emit(GAME_START, {start: true});
            }
    })

    socket.on(USER_IN_GAME, ({username})=>{
        connectedUsers[username].inGame = true;
        io.emit(USER_CONNECTED, connectedUsers);
    })
    socket.on(GAME_REQUEST, ({sender, reciever})=>{
        const rec = connectedUsers[reciever]
        socket.to(rec.socketID).emit(GAME_REQUEST, {sender});  
    })

    socket.on(ADD_SHAPES, (reciever)=>{
        const newShapes = generateShapes(100);
        socket.emit(ADD_SHAPES, newShapes);
        socket.to(connectedUsers[reciever].socketID).emit(ADD_SHAPES, newShapes);
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
    delete newList[playerOne+' '+playerTwo];
    return newList;
}

function removeGame(userList, gameID) {
    let newList = Object.assign({}, userList);
    delete newList[gameID];
    return newList;
}
