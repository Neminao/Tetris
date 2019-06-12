import io from 'socket.io-client';
import { GAME_OVER, INITIALIZE_GAME, USER_CONNECTED, USER_DISCONNECTED, GAME_UPDATE, GAME_INIT, USER_READY, GAME_REQUEST, GAME_START, VERIFY_USER, LOGOUT, USER_IN_GAME, REQUEST_DENIED, RESET, ADD_SHAPES, SPECTATE, SPECTATE_INFO, SEND_TO_SPECTATOR, DISPLAY_GAMES } from './Events'
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

    initMainTetrisContext = (setGeneratedShapes: any, setReciever: any, addShapes: any, showAccepted: any, setRecievers: any, removeSpectator: any, opponentGameOver: any) => {
        this.socket.on(USER_READY, (user: any) => {
            setReciever(user);
            showAccepted(user, true);
        });

        this.socket.on(REQUEST_DENIED, (user: string) => {
            showAccepted(user, false);
        })

        this.socket.on(RESET, (user: any) => {
            removeSpectator(user);
        })

        this.socket.on(ADD_SHAPES, (newShapes: any) => {
            addShapes(newShapes);
        });
        this.socket.on(INITIALIZE_GAME, (obj: any) => {
            setGeneratedShapes(obj.generatedShapes);
            setRecievers(obj.recievers);
        })

        this.socket.on(GAME_OVER, (user: string) => {
            opponentGameOver(user);
        })
    }

    updateGame = (updateSecondCanvas: any) => {
        this.socket.on(GAME_UPDATE, (obj: any) => {
            updateSecondCanvas(obj);
        })
    }
    spectatingGames = (updateSpectatingCanvas: any) => {
        this.socket.on(SEND_TO_SPECTATOR, (obj: any) => {
            updateSpectatingCanvas(obj);
        })

    }
    initUserContainer = (displayUsers: any,
        setSender: any, setRequest: any, startGame: any,
        showRequest: any, setSide: any, setRecievers: any,
        addSpectator: any, updateAvailableGames: any,
        removeReciever: any, setInitBtn: any) => {
        this.socket.on(USER_CONNECTED, (allUsers: any) => {
            displayUsers(allUsers);
        })
        this.socket.on(USER_DISCONNECTED, (obj: any) => {
            displayUsers(obj.allUsers);
            removeReciever(obj.name);
        })
        this.socket.on(INITIALIZE_GAME, (obj: any) => {
            setSide(false);
            setInitBtn(false);
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

       
        this.socket.on(SPECTATE, (spectator: string) => {
            addSpectator(spectator);
        })
        this.socket.on(SPECTATE_INFO, (recievers: any) => {
            setRecievers(recievers);
        })
        this.socket.on(DISPLAY_GAMES, (gamesInProgress: any) => {
            updateAvailableGames(gamesInProgress);
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
    emitUserReady = (user: string, reqSender: string) => {
        this.socket.emit(USER_READY, { user, reqSender });
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
        this.socket.emit(RESET, { to, user });
    }
    emitAddShapes = (reciever: string[]) => {
        this.socket.emit(ADD_SHAPES, reciever);
    }
    emitSpectate = (user: string, game: string) => {
        this.socket.emit(SPECTATE, { user, game });
    }
    emitSpectatorData = (matrix: any, shape: any, spectator: string, user: string, totalScore: number, score: number) => {
        this.socket.emit(SEND_TO_SPECTATOR, { matrix, shape, spectator, user, totalScore, score });
    }
    emitInitializeGame = (sender: string, recievers: string[]) => {
        this.socket.emit(INITIALIZE_GAME, { sender, recievers });
    }
    emitRequestDenied = (user: string, reqSender: string) => {
        this.socket.emit(REQUEST_DENIED, { user, reqSender })
    }
    emitGameOver= (user: string, recievers: string[]) => {
        this.socket.emit(GAME_OVER, {user,recievers});
    }

}

let CM = new ClientManager();
export default CM;