import React from 'react';
import BaseBuildingSquare from './BaseBuildingSquare';
import UniversalShape from './UniversalShape';
import UserContainer from './UserContainer';
import Canvas from './Canvas';
import MiniCanvas from './MiniCanvas';
import CM from './ClientManager';
import Popup from './Popup';
import WinnerPopup from './WinnerPopup';
import AutoComplete from './AutoComplete';
const { generateShapes } = require('./Factories')
const { createEmptyMatrix, isRowComplete, createGrid } = require('./TetrisHelper')

interface MyState {
    currentShape: UniversalShape;
    nextShape: UniversalShape;
    allBlocks: UniversalShape[];
    running: boolean;
    matrix: any[];
    score: number;
    scorePlayer2: number;
    totalScorePlayer2: number;
    scorePlayer3: number;
    totalScorePlayer3: number;
    scorePlayer4: number;
    totalScorePlayer4: number;
    totalScore: number;
    speed: number;
    counterId: number;
    delay: number;
    baseDelay: number;
    acceleration: number;
    columns: number;
    rows: number;
    blockSize: number;
    user: any;
    recievers: string[];
    generatedShapes: any;
    generatedShapesIndex: number;
    isPlayerReady: boolean;
    spectators: string[];
    isSpectator: boolean;
    specCanvases: any;
    reqAccepted: any;
    denied: string[];
    difficulty: number;
    gameMode: number;
    windowHeight: number;
    windowWidth: number;
    shapesCoords: any[];
    winner: any;
}
interface USCProps {
    setDisplay: any;
    user: any;
    difficulty: number;
    mode: number;
}

class UniversalShapeContext extends React.Component<USCProps, MyState>{
    canvasBack = React.createRef<HTMLCanvasElement>();
    canvasFront = React.createRef<HTMLCanvasElement>();
    canvasSide = React.createRef<HTMLCanvasElement>();
    canvasBack2 = React.createRef<HTMLCanvasElement>();
    canvasBack3 = React.createRef<HTMLCanvasElement>();
    canvasBack4 = React.createRef<HTMLCanvasElement>();

    constructor(props: any) {
        super(props);
        let spect = (props.mode == 3) ? true : false;
        this.state = {
            currentShape: this.defaultShape(),
            nextShape: this.defaultShape(),
            allBlocks: [],
            running: false,
            matrix: [],
            score: 0,
            speed: 900,
            counterId: -1,
            delay: 1,
            baseDelay: 20,
            totalScore: 0,
            acceleration: 0,
            columns: 10,
            rows: 20,
            blockSize: 40,
            user: props.user,
            recievers: [],
            scorePlayer2: 0,
            totalScorePlayer2: 0,
            scorePlayer3: 0,
            totalScorePlayer3: 0,
            scorePlayer4: 0,
            totalScorePlayer4: 0,
            generatedShapes: null,
            generatedShapesIndex: 0,
            isPlayerReady: false,
            spectators: [],
            isSpectator: spect,
            specCanvases: null,
            reqAccepted: null,
            denied: [],
            difficulty: props.difficulty,
            gameMode: props.mode,
            windowHeight: window.innerHeight,
            windowWidth: window.innerWidth,
            shapesCoords: [],
            winner: null
        }
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    componentDidMount() {
        this.setState({
            matrix: createEmptyMatrix(10, 20)
        })
        window.addEventListener('keydown', this.handleKeyDown);
        window.addEventListener('keyup', this.onKeyUp);
        this.initSocket();

        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
        if (this.state.gameMode == 1) {
            this.singlePlayer();
        }
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
        window.removeEventListener('keydown', this.handleKeyDown);
        window.removeEventListener('keyup', this.onKeyUp);

        //   CM.emitLogout(this.stopGame)
        CM.emitReset([], this.state.user.name);
        clearInterval(this.state.counterId);
    }


    updateWindowDimensions() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        this.setState({ windowWidth: width, windowHeight: height });
        if (!this.state.running) {
            let size = 40;
            if (height >= 900) {
                size = 40;
            }
            if (height < 900) {
                size = 35;
            }
            if (height < 800) {
                size = 30;
            }
            if (height < 700) {
                size = 25;
            }
            this.setState({
                blockSize: size

            })
            if (this.state.user) {

                const shapes = this.setGeneratedShapes(this.state.shapesCoords);
                this.setState({ generatedShapes: shapes });
            }

        }
    }

    initSocket = () => {
        const { columns, rows, blockSize } = this.state;
        const generatedShapes = CM.generateShapes(columns, rows, blockSize);
        this.setState({
            generatedShapes,
            nextShape: generatedShapes[0]
        });
        CM.initMainTetrisContext(this.setGeneratedShapes, this.setReciever, this.addShapes, this.showAccepted, this.setRecievers, this.removeSpectator, this.opponentGameOver, this.removeReciever, this.setShapesCoords, this.setPlayerReady, this.setDifficulty, this.displayWinner);
        CM.updateGame(this.updateSecondCanvas);
        CM.spectatingGames(this.updateSpectatingCanvas);

    }

    displayWinner = (winnerData: any) => {
        this.setState({
            winner: <WinnerPopup winner={winnerData.winner} score={winnerData.score} close={this.hideWinner} />
        })
    }
    hideWinner = () => {
        this.setState({ winner: null });
    }

    setShapesCoords = (shapesCoords: any[]) => {
        this.setState({ shapesCoords })
    }

    setDifficulty = (difficulty: number) => {
        this.setState({ difficulty });
    }

    setRecievers = (recievers: string[]) => {
        this.setState({ recievers });
    }

    removeReciever = (reciever: string) => {
        let recs = this.state.recievers;
        const { running } = this.state;
        let index = recs.indexOf(reciever);
        console.log(running)
        if (index != -1 && !running) {
            recs.splice(index, 1);
            this.setState({
                recievers: recs
            })
        }
    }

    opponentGameOver = (user: string) => {
        const { recievers } = this.state;
        const index = recievers.indexOf(user);
        let canvas = this.getCanvasBasedOnRecieverIndex(index);
        this.gameOver(canvas);
    }

    addShapes = (newCoords: any) => {
        let currentShapes = this.state.generatedShapes;
        let generatedShapes = [];
        const { columns, rows, blockSize } = this.state;
        let newShapes = newCoords.map((elem: any) => {
            const color = elem.color;
            return new UniversalShape(elem.coords, columns, rows, blockSize, color);
        });
        generatedShapes = currentShapes.concat(newShapes);
        this.setState({
            generatedShapes
        });
    }

    addSpectator = (spectator: string) => {
        let specs = this.state.spectators;
        specs.push(spectator);
        this.setState({
            spectators: specs
        })
    }
    removeSpectator = (spectator: string) => {
        let specs = this.state.spectators;
        let index = specs.indexOf(spectator)
        if (index != -1) {
            specs.splice(index, 1);
        }
        this.setState({
            spectators: specs
        })
    }

    showAccepted = (user: string, tf: boolean) => {
        this.setState({
            reqAccepted: <Popup user={user} accepted={tf} resetPopup={this.resetPopup} />
        })
        if (!tf) {
            let d = this.state.denied;
            d.push(user);
            this.setState({
                denied: d
            })
        }
        setTimeout(this.resetPopup, 5000);
    }

    resetPopup = () => {
        this.setState({
            reqAccepted: null
        })
    }

    setGeneratedShapes = (shapes: any) => {
        let generatedShapes = [];
        const { columns, rows, blockSize } = this.state;
        generatedShapes = shapes.map((elem: any) => {
            const color = elem.color;
            return new UniversalShape(elem.coords, columns, rows, blockSize, color);
        });
        this.setState({
            generatedShapes,
            nextShape: generatedShapes[0],

        });
        return generatedShapes;
    }

    changeSpectatingStatus = (tf: boolean) => {
        this.setState({
            isSpectator: tf
        })
    }

    setUser = (user: any) => {
        CM.emitUserConnected(user);
        this.setState({ user })
    }

    logout = (e: any) => {
        e.preventDefault();
        CM.emitLogout(this.stopGame);
        this.setState({
            currentShape: this.defaultShape(),
            allBlocks: [],
            running: false,
            score: 0,
            speed: 900,
            counterId: -1,
            delay: 1,
            baseDelay: 20,
            totalScore: 0,
            acceleration: 0,
            columns: 10,
            rows: 20,
            blockSize: 40,
            user: null,
            recievers: [],
            scorePlayer2: 0,
            totalScorePlayer2: 0,
            generatedShapes: null,
            generatedShapesIndex: 0,
            isPlayerReady: false,
            matrix: createEmptyMatrix(10, 20),
            nextShape: this.defaultShape(),
        })
    }


    deepCopyShape(obj: any): any {
        var copy: any = obj;
        if (null == obj || "object" != typeof obj) return obj;
        if (obj instanceof Object) {
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr)) copy[attr] = this.deepCopyShape(obj[attr]);
            }
            return copy;
        }
    }

    updateSecondCanvas = (obj: any) => {
        const { columns, blockSize, rows, recievers } = this.state;
        let acc = this.state.acceleration;
        const userIndex = recievers.indexOf(obj.sender);
        let c2: any;
        if (obj.acceleration > acc) {
            this.setState({ acceleration: obj.acceleration });

        }
        const shape1 = new BaseBuildingSquare(0, 0, 'red', blockSize / 2);
        switch (userIndex) {
            case 0: {
                c2 = this.canvasBack2.current; this.setState({
                    totalScorePlayer2: obj.totalScore,
                    scorePlayer2: obj.score
                });
            };
                break;
            case 1: {
                c2 = this.canvasBack3.current;
                this.setState({
                    totalScorePlayer3: obj.totalScore,
                    scorePlayer3: obj.score
                });
            }; break;
            case 2: {
                c2 = this.canvasBack4.current;
                this.setState({
                    totalScorePlayer4: obj.totalScore,
                    scorePlayer4: obj.score
                });
            }; break;
        }
        if (c2) {
            let ctx2: any = c2.getContext('2d');
            ctx2.clearRect(0, 0, columns * blockSize / 2, rows * blockSize / 2);
            let shape = new UniversalShape(obj.shape.coordiantesArr, columns, rows, blockSize / 2, 'red');
            shape.defineNewProperties(obj.shape.blocksArr, 2, blockSize / obj.blockSize);
            createGrid(ctx2, columns, rows, blockSize, 0.5);
            shape.updateCanvas(ctx2)

            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < columns; j++) {
                    if (obj.matrix[i][j].status) {
                        shape1.draw(j * blockSize / 2, i * blockSize / 2, ctx2, 'red');
                    }
                }
            }
        }
    }

    getCanvasBasedOnRecieverIndex = (index: number) => {
        let c2: any = this.canvasBack.current;
        switch (index) {
            case 0:
                c2 = this.canvasBack2.current;
                ;
                break;
            case 1:
                c2 = this.canvasBack3.current;
                ; break;
            case 2:
                c2 = this.canvasBack4.current;
                ; break;
            case 3:
                c2 = this.canvasBack.current;
                ; break;

        }
        return c2;
    }

    setScoreBasedOnRecieverIndex = (index: number, obj: any) => {
        switch (index) {
            case 0:
                this.setState({
                    totalScorePlayer2: obj.totalScore,
                    scorePlayer2: obj.score
                }); break;
            case 1:
                this.setState({
                    totalScorePlayer3: obj.totalScore,
                    scorePlayer3: obj.score
                })
                    ; break;
            case 2:
                this.setState({
                    totalScorePlayer4: obj.totalScore,
                    scorePlayer4: obj.score
                })
                    ; break;
            case 3:
                this.setState({
                    totalScore: obj.totalScore,
                    score: obj.score
                })
                    ; break;

        }
    }

    updateSpectatingCanvas = (obj: any) => {
        const { recievers, columns, blockSize, rows } = this.state;
        let c2: any = this.canvasBack.current;
        const userIndex = recievers.indexOf(obj.user);
        const shape1 = new BaseBuildingSquare(0, 0, 'red', blockSize / 2);
        c2 = this.getCanvasBasedOnRecieverIndex(userIndex);
        this.setScoreBasedOnRecieverIndex(userIndex, obj);
        if (c2) {
            let ctx2: any = c2.getContext('2d');
            ctx2.clearRect(0, 0, columns * blockSize / 2, rows * blockSize / 2);
            let shape = new UniversalShape(obj.shape.coordiantesArr, columns, rows, blockSize / 2, 'red');
            shape.defineNewProperties(obj.shape.blocksArr, 2, blockSize / obj.blockSize);
            createGrid(ctx2, columns, rows, blockSize, 0.5);
            shape.updateCanvas(ctx2)

            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < columns; j++) {
                    if (obj.matrix[i][j].status) {
                        shape1.draw(j * blockSize / 2, i * blockSize / 2, ctx2, 'red');
                    }
                }
            }
        }
    }

    handleKeyDown(event: any) {
        if (this.state.running) {
            let c1: any = this.canvasFront.current;
            const ctx1: any = c1.getContext('2d');
            let shape = this.state.currentShape;
            const mat = this.state.matrix;
            const col = this.state.columns;
            const row = this.state.rows;
            const size = this.state.blockSize;
            const acc = this.state.acceleration;
            let score = this.state.totalScore;
            let delay = 22 - acc;

            if (event.keyCode == 39 && shape.areBlocksFreeToMoveRight(mat)) {
                shape.moveRight();
                this.setState({
                    baseDelay: delay
                })
            }
            else if (event.keyCode == 37 && shape.areBlocksFreeToMoveLeft(mat)) {
                shape.moveLeft();
                this.setState({
                    baseDelay: delay
                })
            }
            ctx1.clearRect(0, 0, col * size, row * size);
            shape.updateCanvas(ctx1);
            if (event.keyCode == 38) {
                this.handleRotate();
                this.setState({
                    baseDelay: delay
                })
            }
            if (event.keyCode == 40) {
                this.setState({
                    baseDelay: 1
                })
            }
            if (event.keyCode == 32) {
                let i = 0;
                while (shape.areBlocksFreeToMoveDown(mat)) {
                    shape.moveDown();
                    i += 1;
                }
                if (!shape.areBlocksFreeToMoveDown(mat)) {
                    this.state.currentShape.moveBack()
                    this.state.currentShape.blocksArr.forEach((element: any) => {
                        if (element) {
                            mat[Math.round(element.top / size)][Math.round(element.left / size)].status = true;
                            mat[Math.round(element.top / size)][Math.round(element.left / size)].color = element.color;
                        }
                    });
                    this.setState({
                        matrix: mat,
                        totalScore: score + i
                    })
                    this.updateStateOfTheGame(shape);
                    clearInterval(this.state.counterId);
                    this.run();

                }
            }
        }
    }

    onKeyUp(event: any) {
        if (event.keyCode == 40) {
            let acc = this.state.acceleration;
            this.setState({
                baseDelay: 20 - acc
            })
        }
    }

    defaultShape = (): UniversalShape => {
        return new UniversalShape([[{ x: 0, y: 0 }]], 10, 20, 40, 'red');
    }

    startGame = () => {

        if (!this.state.running) {
            const { user, gameMode } = this.state;
            if (gameMode == 2)
                CM.emitUserInGame(user.name);
            const col = this.state.columns;
            const row = this.state.rows;
            const size = this.state.blockSize;

            this.run();
            let c1: any = this.canvasBack.current;
            const ctx1: any = c1.getContext('2d');
            ctx1.clearRect(0, 0, col * size, row * size);
            this.setState({
                matrix: createEmptyMatrix(col, row),
                score: 0,
                totalScore: 0
            })
            createGrid(ctx1, col, row, size);
        }
    }

    run = () => {
        this.setState({
            running: true
        })
        const col = this.state.columns;
        const row = this.state.rows;
        const size = this.state.blockSize;
        let arr = this.state.matrix
        console.log(size);
        const { generatedShapes, nextShape, recievers, user, gameMode, score, totalScore, difficulty } = this.state;
        let index = this.state.generatedShapesIndex;
        let acc = this.state.acceleration;
        if (index + 10 == generatedShapes.length) {
            if (gameMode == 2)
                CM.emitAddShapes(recievers);
        }
        this.setState({
            baseDelay: 20 - acc
        })
        let c1: any = this.canvasFront.current;
        const ctx1: any = c1.getContext('2d');
        index += 1;
        this.setState({ generatedShapesIndex: index });
        const shape = generatedShapes[index];

        const next: UniversalShape = this.deepCopyShape(nextShape);
        ctx1.clearRect(0, 0, col * size, row * size);
        const sidec: any = this.canvasSide.current;
        const sidectx = sidec.getContext('2d');
        sidectx.clearRect(0, 0, col * size, row * size);
        if (nextShape != null) {
            console.log(nextShape);
            nextShape.updateCanvas(ctx1);
        }
        if (sidectx) {
            let tempShape = this.deepCopyShape(shape);
            tempShape.fitToSide(2.5);
            tempShape.updateCanvas(sidectx);
            tempShape.fitToSide(-2.5);
        }
        this.setState({
            currentShape: next,
            nextShape: shape
        })
        if (isRowComplete(col, row, arr).length > 0) {
            isRowComplete(col, row, arr).forEach((index: number) => {
                this.clearRow(index);
            });
        }
        if (!this.isGameOver(shape, arr)) {
            let inter: any = setInterval(() => this.moveShape(next, inter), 50);
            this.setState({
                counterId: inter,
            })
        }
        else {
            let totalScore = this.state.totalScore - 10;
            this.setState({
                running: false, totalScore
            });
            this.gameOver(c1);

            CM.emitGameOver(user.name, recievers, score, totalScore, difficulty);
        }
    }
    gameOver = (canvas: any) => {
        let ctx = canvas.getContext('2d');
        let size = canvas.width / 10 + "px";
        ctx.font = "bold " + size + " Verdana";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2)
        ctx.strokeStyle = 'black';
        ctx.strokeText("GAME OVER", canvas.width / 2, canvas.height / 2)
    }
    moveShape = (shape: any, inter: any) => {
        let delay = this.state.delay;

        const { user, columns, rows, blockSize, totalScore, score, recievers, acceleration, spectators, gameMode } = this.state;
        let arr = this.state.matrix;
        if (user && shape) {
            if (gameMode == 2) {
                CM.emitGameUpdate(arr, shape, recievers, user.name, totalScore, score, acceleration, blockSize);
            }

        }
        if (spectators) {
            spectators.forEach(name => {
                CM.emitSpectatorData(arr, shape, name, user.name, totalScore, score, blockSize);
            })
        }
        if (delay <= this.state.baseDelay) {
            delay++;
            this.setState({
                delay: delay
            })
        }
        else {
            this.setState({
                delay: 1,
                baseDelay: 20 - acceleration
            })
            let c1: any = this.canvasFront.current;
            if (c1) {
                const ctx1: any = c1.getContext('2d');
                ctx1.clearRect(0, 0, columns * blockSize, rows * blockSize);

                shape.moveDown();

                if (shape.areBlocksFreeToMoveDown(arr))
                    shape.updateCanvas(ctx1);
            }
            if (!shape.areBlocksFreeToMoveDown(arr)) {
                this.state.currentShape.moveBack();
                this.state.currentShape.blocksArr.forEach((element: any) => {
                    arr[Math.round(element.top / blockSize)][Math.round(element.left / blockSize)].status = true;
                    arr[Math.round(element.top / blockSize)][Math.round(element.left / blockSize)].color = element.color;
                });
                this.setState({
                    matrix: arr,

                })

                this.updateStateOfTheGame(shape);
                clearInterval(inter);
                this.run();

            }
        }
    }
    stopGame = () => {
        clearInterval(this.state.counterId);
    }
    updateStateOfTheGame = (shape: any) => {
        const col = this.state.columns;
        const row = this.state.rows;
        const size = this.state.blockSize;
        let mat = this.state.matrix;
        let c1: any = this.canvasBack.current;
        let total = this.state.totalScore;
        const ctx1: any = c1.getContext('2d');
        const rowsToClear = isRowComplete(col, row, mat);
        if (rowsToClear.length > 0) {
            switch (rowsToClear.length) {
                case 1: total += 100; break;
                case 2: total += 250; break;
                case 3: total += 450; break;
                case 4: total += 800; break;
            }
            rowsToClear.forEach((index: number) => {
                this.clearRow(index);
            });
            ctx1.clearRect(0, 0, col * size, row * size);
            createGrid(ctx1, col, row, size);
        }

        const shape1 = new BaseBuildingSquare(0, 0, 'blue', size)
        for (let i = 0; i < row; i++) {
            for (let j = 0; j < col; j++) {
                if (mat[i][j].status) {
                    shape1.draw(j * size, i * size, ctx1, mat[i][j].color);
                }
            }
        }
        total += 10;
        let arr = this.state.allBlocks;
        shape.moveBack();
        arr.push(this.state.currentShape);
        this.setState({
            totalScore: total
        })
        let acc = this.state.acceleration;
        if (this.state.totalScore > 400 * (acc + 1)) {
            acc++;
            if (acc < 20)
                this.setState({
                    acceleration: acc
                })
        }
    }

    isGameOver = (shape: any, matrix: any[]) => {
        return !shape.areBlocksFreeToMoveDown(matrix)
    }

    clearRow = (index: number) => {
        const col = this.state.columns;
        let mat = this.state.matrix;
        function x() {
            let sub: any[] = [];
            for (let j = 0; j < col; j++) {
                sub.push({ status: false, color: 'white' });
            }
            return sub;
        }
        mat.splice(index, 1);
        mat.unshift(x());
        let score = this.state.score;
        score += 1;

        this.setState({
            matrix: mat,
            score: score,
        })
    }

    handleMove = (event: any) => {
        const col = this.state.columns;
        const row = this.state.rows;
        const size = this.state.blockSize;
        if (this.state.running) {
            const id = event.target.id;
            let c1: any = this.canvasFront.current;
            const ctx1: any = c1.getContext('2d');
            let shape = this.state.currentShape;
            const mat = this.state.matrix;

            if (id == 'right' && shape.areBlocksFreeToMoveRight(mat)) {
                shape.moveRight();
            }
            else if (id == 'left' && shape.areBlocksFreeToMoveLeft(mat)) {
                shape.moveLeft();

            }
            ctx1.clearRect(0, 0, size * col, size * row);
            shape.updateCanvas(ctx1);
        }
    }

    handleRotate = () => {
        const col = this.state.columns;
        const row = this.state.rows;
        const size = this.state.blockSize;
        if (this.state.running) {
            let shape: UniversalShape = this.deepCopyShape(this.state.currentShape);
            let shapehelp = this.state.currentShape;
            shape.rotate();
            if (!shape.areBlockOutOfRotateBoundsLeft() || !shape.areBlockOutOfRotateBoundsRight()) {
                shape.rotate();
                shape.rotate();
                shape.rotate();
                this.setState({
                    currentShape: shapehelp
                })
            }
            else if (shape.areBlocksFreeToRotate(this.state.matrix)) {

                let c1: any = this.canvasFront.current;
                const ctx1: any = c1.getContext('2d');
                ctx1.clearRect(0, 0, size * col, size * row);
                shape.updateCanvas(ctx1);
            }
            else {
                shape.rotate();
                shape.rotate();
                shape.rotate();
                this.setState({
                    currentShape: shapehelp
                })
            }

            this.setState({
                currentShape: shape
            });
        }
    }
    setReciever = (reciever: any) => {
        let rec = this.state.recievers;
        if (rec.length < 3) {
            rec.push(reciever);
        }
        this.setState({
            recievers: rec
        })
    }
    reset = () => {
        clearInterval(this.state.counterId);
        this.setState({
            currentShape: this.defaultShape(),
            nextShape: this.defaultShape(),
            allBlocks: [],
            running: false,
            matrix: createEmptyMatrix(10, 20),
            score: 0,
            speed: 900,
            counterId: -1,
            delay: 1,
            baseDelay: 20,
            totalScore: 0,
            acceleration: 0,
            columns: 10,
            rows: 20,
            blockSize: 40,
            recievers: [],
            scorePlayer2: 0,
            totalScorePlayer2: 0,
            scorePlayer3: 0,
            totalScorePlayer3: 0,
            scorePlayer4: 0,
            totalScorePlayer4: 0,
            generatedShapes: null,
            generatedShapesIndex: 0,
            isPlayerReady: false,
            spectators: [],
            isSpectator: false,
            specCanvases: null,
            reqAccepted: null,
            denied: [],
            difficulty: 7,
            windowHeight: window.innerHeight,
            windowWidth: window.innerWidth
        })
    }

    generateSpecCanvases = () => {
        const { rows, columns, blockSize, recievers, running, isPlayerReady } = this.state;
        let canvases = [];
        for (let i = 0; i < recievers.length; i++) {
            let info = this.generateCanvasData(i);
            if (info) {
                let data = (recievers[i]) ? <div className={info.className}>
                    <Canvas
                        rows={rows}
                        columns={columns}
                        blockSize={blockSize / 2}
                        canvasFront={null}
                        canvasBack={info.canvasBack}
                        running={false}
                        isPlayerReady={true}

                    />
                    <MiniCanvas
                        canvasSide={null}
                        showSide={false}
                        rowScore={info.rowScore}
                        totalScore={info.totalScore}
                        columns={columns}
                        blockSize={blockSize}
                        name={recievers[i]}
                    />
                </div> : null;
                canvases.push(data);
            }
        }
        return canvases;
    }


    generateCanvasData = (index: number) => {
        const { score, scorePlayer2, scorePlayer3, scorePlayer4, totalScore, totalScorePlayer2, totalScorePlayer3, totalScorePlayer4 } = this.state;
        let data = null;
        switch (index) {
            case 0: data = {
                className: 'canvas1',
                rowScore: scorePlayer2,
                totalScore: totalScorePlayer2,
                canvasBack: this.canvasBack2
            }; break;
            case 1: data = {
                className: 'canvas2',
                rowScore: scorePlayer3,
                totalScore: totalScorePlayer3,
                canvasBack: this.canvasBack3
            }; break;
            case 2: data = {
                className: 'canvas3',
                rowScore: scorePlayer4,
                totalScore: totalScorePlayer4,
                canvasBack: this.canvasBack4
            }; break;
            case 3: data = {
                className: 'canvas4',
                rowScore: score,
                totalScore: totalScore,
                canvasBack: this.canvasBack
            }; break;
        }
        return data;
    }

    initGame = () => {
        const { user, recievers, difficulty } = this.state;
        CM.emitInitializeGame(user.name, recievers, difficulty);
        this.setPlayerReady(true);
    }

    setPlayerReady = (tf: boolean) => {
        this.setState({ isPlayerReady: tf })
    }

    singlePlayer = () => {
        const shapesCoords = generateShapes(1000, this.state.difficulty);
        console.log(shapesCoords);
        const shapes = this.setGeneratedShapes(shapesCoords);
        this.setState({
            shapesCoords,
            generatedShapes: shapes,
            nextShape: shapes[0],
            gameMode: 1,
            isPlayerReady: true,

        })
        CM.emitInitializeGame(this.state.user.name, [], this.state.difficulty)

    }


    render() {
        const {
            isSpectator, columns,
            rows, blockSize, score,
            totalScore, user, recievers,
            isPlayerReady, running,
            reqAccepted, denied, difficulty, gameMode, winner } = this.state;
        const canvases = this.generateSpecCanvases();
        return (
            <div onKeyUp={this.onKeyUp} >
                <div>
                    {gameMode == 2 || gameMode == 3 ?
                        <div>

                            <UserContainer
                                setGeneratedShapes={this.setGeneratedShapes}
                                reciever={recievers} startGame={this.startGame}
                                user={user.name} logout={this.logout}
                                setRecievers={this.setRecievers}
                                isPlayerReady={isPlayerReady}
                                changeSpectatingStatus={this.changeSpectatingStatus}
                                running={running} reset={this.reset}
                                addSpectator={this.addSpectator}
                                initGame={this.initGame}
                                denied={denied}
                                isSpectator={isSpectator}
                            />
                            <div className={'transparent'}>
                                {!isPlayerReady && !isSpectator?
                                    <AutoComplete
                                        rows={20}
                                        columns={25}
                                        blockSize={40}
                                    /> : null}
                            </div>
                        </div>
                        : null}


                    {(isPlayerReady) ? <div className={'main'}>
                        <div className='wrap'>
                            <Canvas
                                rows={rows}
                                columns={columns}
                                blockSize={blockSize}
                                canvasFront={this.canvasFront}
                                canvasBack={this.canvasBack}
                                running={running}
                                isPlayerReady={isPlayerReady}
                            />
                        </div>
                        <div className='sideWrap'>
                            <MiniCanvas
                                canvasSide={this.canvasSide}
                                showSide={true}
                                rowScore={score}
                                totalScore={totalScore}
                                columns={columns}
                                blockSize={blockSize}
                                name={user.name}
                                running={running}
                                isPlayerReady={isPlayerReady}
                            />
                            {gameMode == 1 ? <div>
                                <button className="startBtn" onClick={this.startGame}>Start</button>
                            </div> : null}
                        </div>
                        {canvases}
                        {winner}
                    </div> : null}
                    {isSpectator ? <div>
                        <br></br>
                        {canvases}
                    </div> : null}
                </div>
                {reqAccepted}

            </div>


        )
    }
}

export default UniversalShapeContext