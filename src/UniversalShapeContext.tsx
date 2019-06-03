import React from 'react';
import BaseBuildingSquare from './BaseBuildingSquare';
import UniversalShape from './UniversalShape';
import shapeCoordinates from './ShapesCoordinates';
import LoginForm from './LoginForm';
import UserContainer from './UserContainer';
import Canvas from './Canvas';
import MiniCanvas from './MiniCanvas';
import CM from './ClientManager';

interface MyState {
    currentShape: UniversalShape;
    nextShape: UniversalShape;
    allBlocks: UniversalShape[];
    running: boolean;
    matrix: any[];
    score: number;
    scorePlayer2: number;
    totalScorePlayer2: number;
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
    reciever: string;
    generatedShapes: any;
    generatedShapesIndex: number;
    isPlayerReady: boolean;
}

class UniversalShapeContext extends React.Component<{}, MyState>{
    canvasBack = React.createRef<HTMLCanvasElement>();
    canvasFront = React.createRef<HTMLCanvasElement>();
    canvasSide = React.createRef<HTMLCanvasElement>();
    canvasBack2 = React.createRef<HTMLCanvasElement>();
    canvasFront2 = React.createRef<HTMLCanvasElement>();
    canvasSide2 = React.createRef<HTMLCanvasElement>();
    constructor(props: {}) {
        super(props);
        this.state = {
            currentShape: this.defaultShape(),
            nextShape: this.getRandomShape(),
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
            user: null,
            reciever: "",
            scorePlayer2: 0,
            totalScorePlayer2: 0,
            generatedShapes: null,
            generatedShapesIndex: 0,
            isPlayerReady: false
        }
    }

    componentDidMount() {
        this.setState({
            matrix: this.createEmptyMatrix(),
            nextShape: this.getRandomShape(),
        })

        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        document.addEventListener('keyup', this.onKeyUp.bind(this));
        this.initSocket();

    }

    initSocket = () => {
        const { columns, rows, blockSize } = this.state;
        const generatedShapes = CM.generateShapes(columns, rows, blockSize);
        this.setState({
            generatedShapes,
            nextShape: generatedShapes[0]
        });
        CM.updateShapesWhenReady(this.setGeneratedShapes, this.setReciever);
        CM.updateGame(this.updateSecondCanvas);

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
            isPlayerReady: true
        });
        return generatedShapes;
    }

    setPlayerReady = () => {
        this.setState({isPlayerReady: true})
    }

    changePlayerStatus = () => {
        this.setState({
            isPlayerReady: false
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
            reciever: "",
            scorePlayer2: 0,
            totalScorePlayer2: 0,
            generatedShapes: null,
            generatedShapesIndex: 0,
            isPlayerReady: false,
            matrix: this.createEmptyMatrix(),
            nextShape: this.getRandomShape(),
        })
    }

    createEmptyMatrix = (): any[] => {
        let arr: any[] = [];
        const col = this.state.columns;
        const row = this.state.rows;
        function sub(): any[] {
            let sub: any[] = [];
            for (let j = 0; j < col; j++) {
                sub.push({status: false, color: 'white'});
            }
            return sub;
        }
        for (let i = 0; i < row; i++) {
            arr.push(sub());
        }
        function x() {
            let sub: any[] = [];
            for (let j = 0; j < col; j++) {
                sub.push({status: true, color: 'black'});
            }
            return sub;
        }
        arr.push(x())
        return arr;
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
        const { columns, blockSize, rows } = this.state;
        const shape1 = new BaseBuildingSquare(0, 0, 'red', blockSize /2)
        let c2: any = this.canvasBack2.current
        let ctx2: any = c2.getContext('2d');
        ctx2.clearRect(0, 0, columns * blockSize / 2, rows * blockSize /2 );
        let shape = new UniversalShape(obj.shape.coordiantesArr, columns, rows, blockSize / 2, 'red');
        shape.defineNewProperties(obj.shape.blocksArr, 0.5 );
        this.createGrid(ctx2, 0.5);
        shape.updateCanvas(ctx2)

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                if (obj.matrix[i][j].status) {
                    shape1.draw(j * blockSize /2, i * blockSize /2, ctx2, 'red');
                }
            }
        }
        this.setState({
            totalScorePlayer2: obj.totalScore,
            scorePlayer2: obj.score
        })
    }



    handleKeyDown = (event: any) => {
        if (this.state.running) {
            let c1: any = this.canvasFront.current;
            const ctx1: any = c1.getContext('2d');
            let shape = this.state.currentShape;
            const mat = this.state.matrix;
            const col = this.state.columns;
            const row = this.state.rows;
            const size = this.state.blockSize;

            if (event.keyCode == 39 && shape.areBlocksFreeToMoveRight(mat)) {
                shape.moveRight();
            }
            else if (event.keyCode == 37 && shape.areBlocksFreeToMoveLeft(mat)) {
                shape.moveLeft();
            }
            ctx1.clearRect(0, 0, col * size, row * size);
            shape.updateCanvas(ctx1);
            if (event.keyCode == 38) {
                this.handleRotate();
            }
            if (event.keyCode == 40) {
                this.setState({
                    baseDelay: 1
                })
            }
            if (event.keyCode == 32) {
                while (shape.areBlocksFreeToMoveDown(mat)) {
                    shape.moveDown();
                }
                if (!shape.areBlocksFreeToMoveDown(mat)) {
                    this.state.currentShape.moveBack()
                    this.state.currentShape.blocksArr.forEach((element: any) => {
                        mat[element.top / size][element.left / size].status = true;
                        mat[element.top / size][element.left / size].color = element.color;
                    });
                    this.setState({
                        matrix: mat
                    })
                    this.updateStateOfTheGame(shape);
                    clearInterval(this.state.counterId);
                    this.run();

                }
            }
        }
    }

    onKeyUp = (event: any) => {
        if (event.keyCode == 40) {
            let acc = this.state.acceleration;
            this.setState({
                baseDelay: 20 - acc
            })
        }
    }

    createGrid = (ctx: any, scale?: number) => {
        const col = this.state.columns;
        const row = this.state.rows;
        let size = this.state.blockSize;
        if(scale) size = size /2;
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#ccc';
        for (let i = 1; i < row; i++) {
            ctx.beginPath()
            ctx.moveTo(0, i * size);
            ctx.lineTo(col * size, i * size);
            ctx.stroke();
        }
        for (let i = 1; i < col; i++) {
            ctx.beginPath()
            ctx.moveTo(i * size, 0);
            ctx.lineTo(i * size, row * size);
            ctx.stroke();
        }
    }

    defaultShape = (): UniversalShape => {
        return new UniversalShape([[{ x: 0, y: 0 }]], 10, 20, 40, 'red');
    }

    getRandomShape = (): UniversalShape => {
        let index = Math.floor(Math.random() * Math.floor(10));
        if (undefined == this.state) {
            return new UniversalShape(shapeCoordinates[index], 10, 20, 40, 'red');
        }
        return new UniversalShape(shapeCoordinates[index], this.state.columns, this.state.rows, this.state.blockSize, 'red');
    }

    startGame = () => {

        if (!this.state.running) {
            const { user } = this.state;
            CM.emitUserInGame(user.name);
            const col = this.state.columns;
            const row = this.state.rows;
            const size = this.state.blockSize;

            this.run();
            let c1: any = this.canvasBack.current;
            const ctx1: any = c1.getContext('2d');
            ctx1.clearRect(0, 0, col * size, row * size);
            this.setState({
                matrix: this.createEmptyMatrix(),
                score: 0,
                totalScore: 0
            })
            this.createGrid(ctx1);
        }
    }

    run = () => {
        this.setState({
            running: true
        })
        const col = this.state.columns;
        const row = this.state.rows;
        const size = this.state.blockSize;
        const { generatedShapes, nextShape } = this.state;
        let index = this.state.generatedShapesIndex;
        let acc = this.state.acceleration;
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
        if (nextShape != null)
            nextShape.updateCanvas(ctx1);
        if (sidectx)
            shape.updateCanvas(sidectx);
        this.setState({
            currentShape: next,
            nextShape: shape
        })
        if (this.isRowComplete().length > 0) {
            this.isRowComplete().forEach(index => {
                this.clearRow(index);
            });
        }
        if (!this.isGameOver()) {
            let inter: any = setInterval(() => this.moveShape(next, inter), 50);
            this.setState({
                counterId: inter,
            })
        }
        else {
            this.setState({
                running: false
            });
            window.alert("Game over")
        }
    }

    moveShape = (shape: any, inter: any) => { // temp
        let delay = this.state.delay;
        const {user, columns, rows, blockSize, totalScore, score, reciever} = this.state;
        let arr = this.state.matrix;
        if(user){
        CM.emitGameUpdate(arr, shape, reciever, user.name, totalScore, score);
    }
        if (delay <= this.state.baseDelay) {
            delay++;
            this.setState({
                delay: delay
            })
        }
        else {
            this.setState({
                delay: 1
            })
            let c1: any = this.canvasFront.current;
            if(c1){
            const ctx1: any = c1.getContext('2d');
            ctx1.clearRect(0, 0, columns * blockSize, rows * blockSize);
            
            shape.moveDown();

            if (shape.areBlocksFreeToMoveDown(arr))
                shape.updateCanvas(ctx1);
            }
            if (!shape.areBlocksFreeToMoveDown(arr)) {
                this.state.currentShape.moveBack();
                this.state.currentShape.blocksArr.forEach((element: any) => {
                    arr[element.top / blockSize][element.left / blockSize].status = true;
                    arr[element.top / blockSize][element.left / blockSize].color = element.color;
                });
                this.setState({
                    matrix: arr
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
    updateStateOfTheGame = (shape: any) => { // temp
        const col = this.state.columns;
        const row = this.state.rows;
        const size = this.state.blockSize;
        let c1: any = this.canvasBack.current;
        const ctx1: any = c1.getContext('2d');
        if (this.isRowComplete().length > 0) {
            this.isRowComplete().forEach(index => {
                this.clearRow(index);
            });
            ctx1.clearRect(0, 0, col * size, row * size);
            this.createGrid(ctx1);
        } 

        const shape1 = new BaseBuildingSquare(0, 0, 'blue', size)
        const mat = this.state.matrix;
        for (let i = 0; i < row; i++) {
            for (let j = 0; j < col; j++) {
                if (mat[i][j].status) {
                    shape1.draw(j * size, i * size, ctx1, mat[i][j].color);
                }
            }
        }

        let total = this.state.totalScore;
        total += 10;
        let arr = this.state.allBlocks;
        shape.moveBack();
        arr.push(this.state.currentShape);
        this.setState({
            totalScore: total
        })
        let acc = this.state.acceleration;
        if (this.state.totalScore > 700 * (acc + 1)) {
            acc++;
            if (acc < 20)
                this.setState({
                    acceleration: acc
                })
        }
    }

    isGameOver = () => {
        let pom = false
        this.state.matrix[1].forEach((el: any) => {
            if (el.status) {
                pom = true;
            }
        })
        return pom;
    }

    delay = (ms: number) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    clearRow = (index: number) => {
        const col = this.state.columns;
        let mat = this.state.matrix;
        function x() {
            let sub: any[] = [];
            for (let j = 0; j < col; j++) {
                sub.push({status:false,color:'white'});
            }
            return sub;
        }
        mat.splice(index, 1);
        mat.unshift(x());
        let score = this.state.score;
        score += 1;
        let total = this.state.totalScore;
        total += 100;
        this.setState({
            matrix: mat,
            score: score,
            totalScore: total
        })
    }

    isRowComplete = () => {
        const col = this.state.columns;
        const row = this.state.rows;
        const arr = this.state.matrix;
        let numArr = []
        for (let i = 0; i < row; i++) {
            let counter = 0;
            arr[i].forEach((subEl: any) => {
                if (subEl.status) counter++;
            })
            if (counter == col) {
                numArr.push(i);
            }
        }
        return numArr;
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
        this.setState({
            reciever
        })
    }
    reset = () => {
        const rec = this.state.reciever;
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
            reciever: "",
            scorePlayer2: 0,
            totalScorePlayer2: 0,
            generatedShapes: null,
            generatedShapesIndex: 0,
            isPlayerReady: false,
            matrix: this.createEmptyMatrix(),
            nextShape: this.getRandomShape(),
        })
        CM.emitReset(rec);
    }
    render() {
        const { columns, rows, blockSize, score, totalScore, user, scorePlayer2, totalScorePlayer2, reciever, isPlayerReady, running } = this.state;
        return (
            <div onKeyUp={this.onKeyUp} >
                <div>{
                    !user ?
                        <LoginForm setUser={this.setUser} /> : <div>
                            
                            <UserContainer
                                setGeneratedShapes={this.setGeneratedShapes}
                                reciever={reciever} startGame={this.startGame}
                                user={user.name} logout={this.logout}
                                setReciever={this.setReciever}
                                isPlayerReady={isPlayerReady}
                                changePlayerStatus={this.changePlayerStatus}
                                running={running} reset={this.reset}/>

                        </div>}

                    {(isPlayerReady) ? <div className={'main'}>
                        <div className='wrap'>
                            <Canvas
                                rows={rows}
                                columns={columns}
                                blockSize={blockSize}
                                
                                canvasFront={this.canvasFront}
                                canvasBack={this.canvasBack}
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
                            />
                            <Canvas
                                rows={rows}
                                columns={columns}
                                blockSize={blockSize / 2}
                                canvasFront={this.canvasFront2}
                                canvasBack={this.canvasBack2}
                             />   
                             <MiniCanvas 
                            canvasSide={this.canvasSide2}
                            showSide={false} 
                            rowScore={scorePlayer2}
                             totalScore={totalScorePlayer2}
                             columns={columns}
                             blockSize={blockSize}
                            />   

                        </div>
                    </div> : null}
                </div>

            </div>

        )
    }
}

export default UniversalShapeContext