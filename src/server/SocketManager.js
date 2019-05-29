const io = require('./server.js').io;

const { VERIFY_USER, USER_CONNECTED, LOGOUT, GAME_UPDATE, USER_DISCONNECTED, GAME_START, USER_READY, GAME_INIT, USER_IN_GAME, GAME_REQUEST } = require('../Events.js')

const { createUser, generateShapes } = require('../factories')

let connectedUsers = {}

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
    socket.on(GAME_UPDATE, ({ matrix, shape, reciever, sender, score, totalScore }) => {
        if (reciever in connectedUsers) {
            const recSocket = connectedUsers[reciever].socketID;
            socket.to(recSocket).emit(GAME_UPDATE, { matrix: matrix, shape: shape, score, totalScore });
        }
    })
    socket.on(LOGOUT, () => {
        connectedUsers = removeUser(connectedUsers, socket.user.name)
        io.emit(USER_DISCONNECTED, connectedUsers);
        console.log("Disconnect", connectedUsers);
    })
    
    socket.on(GAME_INIT, () => {       
        socket.emit(GAME_INIT, generateShapes());
    })

    socket.on(USER_READY, ({to, user})=>{
        if (to in connectedUsers) {
            let recSocket = connectedUsers[to];
            let current = connectedUsers[user];
            if(!current.inGame && !recSocket.inGame){
            recSocket.inGame = true;
            current.inGame = true;
            console.log("rec: " + recSocket.inGame);
            console.log("curr: " + current.inGame);
            const generatedShapes = generateShapes()
            socket.to(recSocket.socketID).emit(USER_READY, generatedShapes);
            socket.emit(USER_READY, generatedShapes)
        }}
    })

    socket.on(GAME_START, ({to, user}) => {
        console.log('to: '+to);
        const rec = connectedUsers[to];
            socket.emit(GAME_START, {start: true});
            if(to){
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

