import io from 'socket.io-client';
import { LIST_UPDATE, REGISTER, WINNER, HIGHSCORE, GAME_OVER, INITIALIZE_GAME, USER_CONNECTED, USER_DISCONNECTED, GAME_UPDATE, GAME_INIT, USER_READY, GAME_REQUEST, GAME_START, VERIFY_USER, LOGOUT, USER_IN_GAME, REQUEST_DENIED, RESET, ADD_SHAPES, SPECTATE, SPECTATE_INFO, SEND_TO_SPECTATOR, DISPLAY_GAMES, GAME_SETUP, MULTIPLAYER } from './Events'
import UniversalShape from './UniversalShape';

const socketUrl = "http://localhost:3231"; // change to local ip with same port for testing // port must match port defined in socket

class ClientManager {
    socket = io(socketUrl);
    initSocket = () => {

        this.socket.on('connect', () => {
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

    initMainTetrisContext = (setGeneratedShapes: any, setReciever: any, addShapes: any, showAccepted: any, setRecievers: any, removeSpectator: any, opponentGameOver: any, removeReciever: any, setShapesCoords: any, setPlayerReady: any, setDifficulty: any, displayWinner: any) => {
        this.socket.on(USER_READY, (obj: any) => {
            if (obj.tf) {
                setReciever(obj.user);
                showAccepted(obj.user, true);
            }
        });

        this.socket.on(WINNER, (winnerData: any) => {
            displayWinner(winnerData);
        })

        this.socket.on(USER_DISCONNECTED, (obj: any) => {
            removeReciever(obj.name);
        })

        this.socket.on(REQUEST_DENIED, (user: string) => {
            showAccepted(user, false);
        })

        this.socket.on(RESET, (user: any) => {
            removeSpectator(user);
            removeReciever(user);
        })

        this.socket.on(ADD_SHAPES, (newShapes: any) => {
            addShapes(newShapes);
        });
        this.socket.on(INITIALIZE_GAME, (obj: any) => {
            setGeneratedShapes(obj.generatedShapes);
            setShapesCoords(obj.generatedShapes)
            setRecievers(obj.recievers);
            setDifficulty(obj.difficulty);
            setPlayerReady(true);
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

    initMenu = (setHighscore: any) => {
        this.socket.on(HIGHSCORE, (result: any) => {
            setHighscore(result);
        })
    }
    initUserContainer = (displayUsers: any,
        setSender: any, setRequest: any, startGame: any, setSide: any, setRecievers: any,
        addSpectator: any, updateAvailableGames: any, setInitBtn: any, updateGameSetupScreen: any,
        emitGameSetup: any, reset: any, removeInvitedPlayer: any, removeGameMaster: any) => {
        this.socket.on(RESET, (user: string) => {
            removeInvitedPlayer(user);
            removeGameMaster(user);
        })
        this.socket.on(USER_CONNECTED, (allUsers: any) => {
            displayUsers(allUsers);
        })
        this.socket.on(USER_DISCONNECTED, (obj: any) => {
            displayUsers(obj.allUsers);
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
        this.socket.on(GAME_SETUP, (obj: any) => {
            updateGameSetupScreen(obj);
        })
        this.socket.on(USER_READY, (obj: any) => {
            if (obj.tf)
                emitGameSetup();
            else reset();
        })
    }

    initRegister = (setError: any, setDisplay: any) => {
        this.socket.on(REGISTER, (success: boolean) => {
            if(success){
                setDisplay({target: {value: 3}})
            }
            else {
                setError("User already exists!");
            }
        })
    }


    emitGameUpdate = (matrix: any, shape: any, reciever: string[], sender: string, totalScore: number, score: number, acceleration: number, blockSize: number) => {
        this.socket.emit(GAME_UPDATE, { matrix, shape, reciever, sender, totalScore, score, acceleration, blockSize });
    }
    emitUserInGame = (username: string) => {
        this.socket.emit(USER_IN_GAME, { username });
    }
    emitLogout = () => {
        this.socket.emit(LOGOUT);
    }
    emitUserConnected = (user: any) => {
        this.socket.emit(USER_CONNECTED, user);
    }
    emitUserReady = (user: string, reqSender: string) => {
        this.socket.emit(USER_READY, { user, reqSender });
    }
    emitGameRequest = (sender: string, reciever: string) => {
        this.socket.emit(GAME_REQUEST, { sender, reciever });
    }
    emitGameStart = (to: string[], user: string) => {
        this.socket.emit(GAME_START, { to, user });
    }
    emitVerifyUser = (nickname: string, password: string, setUser: any) => {
        this.socket.emit(VERIFY_USER, nickname, password, setUser);
    }
    emitReset = (to: string[], user: string, keepGameMode? : boolean) => {
        this.socket.emit(RESET, { to, user, keepGameMode });
    }
    emitAddShapes = (reciever: string[]) => {
        this.socket.emit(ADD_SHAPES, reciever);
    }
    emitSpectate = (user: string, game: string) => {
        this.socket.emit(SPECTATE, { user, game });
    }
    emitSpectatorData = (matrix: any, shape: any, spectator: string, user: string, totalScore: number, score: number, blockSize: number) => {
        this.socket.emit(SEND_TO_SPECTATOR, { matrix, shape, spectator, user, totalScore, score, blockSize });
    }
    emitInitializeGame = (sender: string, recievers: string[], difficulty: number) => {
        this.socket.emit(INITIALIZE_GAME, { sender, recievers, difficulty });
    }
    emitRequestDenied = (user: string, reqSender: string) => {
        this.socket.emit(REQUEST_DENIED, { user, reqSender })
    }
    emitGameOver = (user: string, recievers: string[], score: number, totalScore: number, difficulty: number) => {
        this.socket.emit(GAME_OVER, { user, recievers, score, totalScore, difficulty });
    }
    emitGameSetup = (master: string, recievers: string[]) => {
        this.socket.emit(GAME_SETUP, { master, recievers });
    }

    emitRegister = (name: string, password: string) => {
        this.socket.emit(REGISTER, { name, password })
    }

    emitListUpdate = () => {
        this.socket.emit(LIST_UPDATE);
    }

    emitMultiplayer = (user: string) => {
        this.socket.emit(MULTIPLAYER, user);
    }

}

let CM = new ClientManager();
export default CM;