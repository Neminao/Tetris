const io = require('./server.js').io;

const { VERIFY_USER, USER_CONNECTED, LOGOUT, GAME_UPDATE, USER_DISCONNECTED, GAME_START, USER_READY, GAME_INIT, READY, USER_IN_GAME } = require('./Events.js')

const { createUser, generateShapes } = require('./factories')

let connectedUsers = {}

module.exports = function (socket) {
    console.log(socket.id)
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

    socket.on(USER_READY, (reciever)=>{
        if (reciever in connectedUsers) {
            const recSocket = connectedUsers[reciever].socketID;
            const generatedShapes = generateShapes()
            socket.to(recSocket).emit(USER_READY, generatedShapes);
            socket.emit(USER_READY, generatedShapes)
        }
    })

    socket.on(GAME_START, ({sender, reciever}) => {
        const rec = connectedUsers[reciever]
        console.log(sender + " " + reciever)
        if(connectedUsers[sender].isReady && rec.isReady){
            socket.emit(GAME_START, true);
            socket.to(rec.socketID).emit(GAME_START, {start: true})
        }
    })
    socket.on(READY, (user)=> {
        connectedUsers[user].isReady = true;
        console.log(user)
        io.emit(USER_CONNECTED, connectedUsers);
    })

    socket.on(USER_IN_GAME, ({username})=>{
        connectedUsers[username].inGame = true;
        io.emit(USER_CONNECTED, connectedUsers);
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

