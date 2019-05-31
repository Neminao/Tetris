import io from 'socket.io-client';
import { USER_CONNECTED, USER_DISCONNECTED, GAME_UPDATE, GAME_INIT, USER_READY, GAME_REQUEST, GAME_START, VERIFY_USER, LOGOUT, USER_IN_GAME } from './Events'
import UniversalShape from './UniversalShape';

const socketUrl = "http://localhost:3231";

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
    updateShapesWhenReady = (setGeneratedShapes: any) => {
        this.socket.on(USER_READY, (generatedShapes: any) => {
            setGeneratedShapes(generatedShapes);
        });
    }
    updateSecondCanvas = (updateSecondCanvas: any) => {
        this.socket.on(GAME_UPDATE, (obj: any) => {
            updateSecondCanvas(obj);
        })
    }
    updateGame = (updateSecondCanvas: any) => {
        this.socket.on(GAME_UPDATE, (obj: any) => {
            updateSecondCanvas(obj);
        })
    }
    initUserContainer = (displayUsers: any, setSender: any, setRequest: any, startGame: any) => {
        this.socket.on(USER_CONNECTED, (allUsers: any) => {
            displayUsers(allUsers);
        })
        this.socket.on(USER_DISCONNECTED, (allUsers: any) => {
            displayUsers(allUsers);
        })
        this.socket.on(GAME_REQUEST, ({ sender }: any) => {
            setSender(sender);
        })
        this.socket.on(GAME_START, ({ start }: any) => {

            if (start) {
                setRequest();
                startGame();
            }
        })
    }
    emitGameUpdate = (matrix: any, shape: any, reciever: string, sender: string, totalScore: number, score: number) => {
        this.socket.emit(GAME_UPDATE, { matrix, shape, reciever, sender, totalScore, score });
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
    emitUserReady = (to: string, user: string) => {
        this.socket.emit(USER_READY, { to, user });
    }
    emitGameRequest = (sender: string, reciever: string) => {
        this.socket.emit(GAME_REQUEST, { sender, reciever });
    }
    emitGameStart = (to: string, user: string) => {
        this.socket.emit(GAME_START, { to, user });
    }
    emitVerifyUser = (nickname: string, setUser: any) => {
        this.socket.emit(VERIFY_USER, nickname, setUser);
    }
    emitReset = (to: string) => {

    }
}

let CM = new ClientManager();
export default CM;