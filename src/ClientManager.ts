import io from 'socket.io-client';
import { USER_CONNECTED, USER_DISCONNECTED, GAME_UPDATE, GAME_INIT, USER_READY, GAME_REQUEST, GAME_START, VERIFY_USER, LOGOUT, USER_IN_GAME, REQUEST_DENIED, RESET, ADD_SHAPES } from './Events'
import UniversalShape from './UniversalShape';

const socketUrl = "http://192.168.88.14:3231";

class ClientManager {
    socket = io(socketUrl);
    initSocket = () => {

        this.socket.on('connect', () => {
            console.log('connected')
        })
        return this.socket;
    }
    generateShapes = (columns: number, rows: number, blockSize: number): any[] => {
        let shapes: any[] = [];
        this.socket.on(GAME_INIT, (shapes: any) => {
            let generatedShapes = shapes.map((elem: any) => {
                return new UniversalShape(elem.coords, columns, rows, blockSize, elem.color);
            })

            shapes = generatedShapes;
        })
        return shapes;
    }
    
    updateShapesWhenReady = (setGeneratedShapes: any, setReciever: any, addShapes: any) => {
        this.socket.on(USER_READY, ({generatedShapes, reciever}: any) => {
            setGeneratedShapes(generatedShapes);
            console.log(reciever);
            setReciever(reciever);
        });
        this.socket.on(ADD_SHAPES, (newShapes: any)=>{
            addShapes(newShapes);
        })
    }
    
    updateGame = (updateSecondCanvas: any) => {
        this.socket.on(GAME_UPDATE, (obj: any) => {
            updateSecondCanvas(obj);
        })
    }
    initUserContainer = (displayUsers: any, setSender: any, setRequest: any, startGame: any, showRequest: any, setSide: any, setReciever: any) => {
        this.socket.on(USER_CONNECTED, (allUsers: any) => {
            displayUsers(allUsers);
        })
        this.socket.on(USER_DISCONNECTED, (allUsers: any) => {
            displayUsers(allUsers);
        })
        this.socket.on(GAME_REQUEST, ({ sender }: any) => {
            console.log(sender)
            setSender(sender);
        })
        this.socket.on(GAME_START, ({ start }: any) => {

            if (start) {
                setRequest();
                startGame();
            }
        })
        this.socket.on(REQUEST_DENIED, (denied: boolean)=>{
            showRequest(denied);
            setSide(true);
        })
        this.socket.on(USER_READY, (obj: any)=> {
            setSide(false);
        })
        this.socket.on(RESET, ()=>{
            setSender("");
            setReciever("")
        })
        
    }
    emitGameUpdate = (matrix: any, shape: any, reciever: string[], sender: string, totalScore: number, score: number, acceleration: number) => {
        this.socket.emit(GAME_UPDATE, { matrix, shape, reciever, sender, totalScore, score, acceleration });
    }
    emitUserInGame = (username: string) => {
        this.socket.emit(USER_IN_GAME, { username });
    }
    emitLogout = (stopGame: any) => {
        stopGame();
        this.socket.emit(LOGOUT);
    }
    emitUserConnected = (user: any) => {
        this.socket.emit(USER_CONNECTED, user);
    }
    emitUserReady = (to: string[], user: string) => {
        console.log(to);
        this.socket.emit(USER_READY, { to, user });
    }
    emitGameRequest = (sender: string, reciever: string[]) => {
        this.socket.emit(GAME_REQUEST, { sender, reciever });
    }
    emitGameStart = (to: string[], user: string) => {
        this.socket.emit(GAME_START, { to, user });
    }
    emitVerifyUser = (nickname: string, setUser: any) => {
        this.socket.emit(VERIFY_USER, nickname, setUser);
    }
    emitReset = (to: string[], user: string) => {
        this.socket.emit(RESET, {to, user});
    }
    emitAddShapes = (reciever: string[]) => {
        this.socket.emit(ADD_SHAPES, reciever);
    }   
}

let CM = new ClientManager();
export default CM;