const io = require('./server.js').io;

const {VERIFY_USER, USER_CONNECTED, LOGOUT, GAME_UPDATE} = require('./Events.js')

const { createUser } = require('./factories')

let connectedUsers = {}

module.exports = function(socket){
    console.log(socket.id)
socket.on(VERIFY_USER, (nickname, callback) => {
    if(isUser(connectedUsers, nickname)){
        callback({ isUser: true, user: null})
    }
    else{
        callback({isUser: false, user:createUser({name:nickname, socketID: socket.id})})
    }
})

socket.on(USER_CONNECTED, (user)=>{
    user.socketID = socket.id;
    connectedUsers = addUser(connectedUsers, user)
    
    socket.user = user
    io.emit(USER_CONNECTED, connectedUsers)
    console.log(connectedUsers)
})
socket.on(GAME_UPDATE, ({matrix, shape, reciever, sender}) => {
    if(reciever in connectedUsers){
        const recSocket = connectedUsers[reciever].socketID;
        socket.to(recSocket).emit(GAME_UPDATE, {matrix: matrix, shape: shape});
    }
})
}

function isUser(userList, username){
    return username in userList
}
 
function addUser(userList,user){
    let newList = Object.assign({},userList)
    newList[user.name] = user
    return newList;
}
function removeUser(userList, username){
    let newList = Object.assign({},userList)
    delete newList[username]
    return newList
}

