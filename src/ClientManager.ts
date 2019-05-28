import io from 'socket.io-client';
import { USER_CONNECTED, USER_DISCONNECTED, LOGOUT, GAME_UPDATE, GAME_START, GAME_INIT, USER_READY, READY, USER_IN_GAME } from './Events'
import UniversalShape from './UniversalShape'
import shapeCoordinates from './ShapesCoordinates';

const socketUrl = "http://localhost:3231";

class SocketManager {
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
                return new UniversalShape(elem, columns, rows, blockSize);
            })

            shapes = generatedShapes;
        })
        this.socket.on(USER_READY, (shapes: any) => {
            let generatedShapes = shapes.map((elem: any) => {
                return new UniversalShape(elem, columns, rows, blockSize);
            })

            shapes = generatedShapes;
        })
        return shapes;
    }
    updateSecondCanvas = (updateSecondCanvas: any) => {
        this.socket.on(GAME_UPDATE, (obj: any) => {
            updateSecondCanvas(obj);
        })
    }
    initUserContainer = (displayUsers: any) => {
        this.socket.on(USER_CONNECTED, (allUsers: any) => {
            displayUsers(allUsers);
        })
        this.socket.on(USER_DISCONNECTED, (allUsers: any) => {
            displayUsers(allUsers);
        })
    }
}

export default SocketManager

