import React from 'react'
import BaseBuildingSquare from './BaseBuildingSquare';
import UniversalShape from './UniversalShape';
import shapeCoordinates from './Shapes'

interface MyState {
    currentShape: UniversalShape;
    nextShape: UniversalShape;
    allBlocks: UniversalShape[];
    running: boolean;
    matrix: any[];
    score: number;
    totalScore: number;
    speed: number;
    counterId: number;
    delay: number;
    baseDelay: number;
    acceleration: number;
    columns: number;
    rows: number;
    blockSize: number;
}

interface Coordiantes {
    x: number;
    y: number;
}
class UniversalShapeContext extends React.Component<{}, MyState>{
    canvasBack = React.createRef<HTMLCanvasElement>();
    canvasFront = React.createRef<HTMLCanvasElement>();
    canvasSide = React.createRef<HTMLCanvasElement>();
    constructor(props: {}) {
        super(props);
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
            blockSize: 40
        }
    }

    createEmptyMatrix = (): any[] => {
        let arr: any[] = [];
        const col = this.state.columns;
        const row = this.state.rows;
        function sub(): boolean[] {
            let sub: boolean[] = [];
            for (let j = 0; j < col; j++) {
                sub.push(false);
            }
            return sub;
        }
        for (let i = 0; i < row; i++) {
            arr.push(sub());
        }
        function x() {
            let sub: boolean[] = [];
            for (let j = 0; j < col; j++) {
                sub.push(true);
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

    componentDidMount() {
        let c2: any = this.canvasBack.current;
        let c1: any = this.canvasFront.current;
        let c3: any = this.canvasSide.current;
        const col = this.state.columns;
        const row = this.state.rows;
        const size = this.state.blockSize;
        c1.width = col * size;
        c1.height = row * size;
        c2.width = col * size;
        c2.height = row * size;
        c3.width = col * size;
        c3.height = 2 * size;
        this.setState({
            matrix: this.createEmptyMatrix(),
            nextShape: this.getRandomShape()
        })
        this.createGrid(c2.getContext('2d'));
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
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
                        mat[element.top / size][element.left / size] = true;
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

    createGrid = (ctx: any) => {
        const col = this.state.columns;
        const row = this.state.rows;
        const size = this.state.blockSize;
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
        return new UniversalShape([[{ x: 0, y: 0 }]], 10, 20, 40);
    }

    getRandomShape = (): UniversalShape => {
        let index = Math.floor(Math.random() * Math.floor(10));
        return new UniversalShape(shapeCoordinates[index], this.state.columns, this.state.rows, this.state.blockSize);
    }

    startGame = () => {
        this.setState({
            running: true
        })
        if (!this.state.running){
            const col = this.state.columns;
          const row = this.state.rows;
            const size = this.state.blockSize;
            this.run();
            let c1: any = this.canvasBack.current;
            const ctx1: any = c1.getContext('2d');
            ctx1.clearRect(0, 0, col * size, row * size);
            this.setState({
                matrix: this.createEmptyMatrix(),
                nextShape: this.getRandomShape()
            })
            this.createGrid(ctx1);
        }
    }

    run = () => {
        const col = this.state.columns;
        const row = this.state.rows;
        const size = this.state.blockSize;
        let acc = this.state.acceleration;
        this.setState({
            baseDelay: 20 - acc
        })
        let c1: any = this.canvasFront.current;
        const ctx1: any = c1.getContext('2d');
        const shape = this.getRandomShape();
        const next: UniversalShape = this.deepCopyShape(this.state.nextShape);
        ctx1.clearRect(0, 0, col * size, row * size);
        const sidec: any = this.canvasSide.current;
        const sidectx = sidec.getContext('2d');
        sidectx.clearRect(0, 0, col * size, row * size);
        if (next != null)
            next.updateCanvas(ctx1);
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
        const col = this.state.columns;
        const row = this.state.rows;
        const size = this.state.blockSize;
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
            let arr = this.state.matrix;
            const ctx1: any = c1.getContext('2d');
            ctx1.clearRect(0, 0, col * size, row * size);
            shape.moveDown();
            if (shape.areBlocksFreeToMoveDown(arr))
                shape.updateCanvas(ctx1);

            if (!shape.areBlocksFreeToMoveDown(arr)) {
                this.state.currentShape.moveBack();
                this.state.currentShape.blocksArr.forEach((element: any) => {
                    arr[element.top / size][element.left / size] = true;
                });
                this.setState({
                    matrix: arr
                })
                this.updateStateOfTheGame(shape);
                console.log(arr);

                clearInterval(inter);
                this.run();

            }
        }
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
                if (mat[i][j]) {
                    shape1.draw(j * size, i * size, ctx1);
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
        this.state.matrix[1].forEach((el: boolean) => {
            if (el) {
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
        const row = this.state.rows;
        const size = this.state.blockSize;
        let mat = this.state.matrix;
        function x() {
            let sub: boolean[] = [];
            for (let j = 0; j < col; j++) {
                sub.push(false);
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
        const size = this.state.blockSize;
        const arr = this.state.matrix;
        let numArr = []
        for (let i = 0; i < row; i++) {
            let counter = 0;
            arr[i].forEach((subEl: any) => {
                if (subEl) counter++;
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
                console.log(true);
            }
            else {
                shape.rotate();
                shape.rotate();
                shape.rotate();
                this.setState({
                    currentShape: shapehelp
                })
            }
            console.log('shape: ')
            console.log(shape);
            console.log('shapehelp: ')
            console.log(shapehelp);

            this.setState({
                currentShape: shape
            });
        }
    }

    render() {
        const style = { "height": this.state.rows * this.state.blockSize, "width": this.state.columns * this.state.blockSize };
        const style2 = { "height": 2 * this.state.blockSize, "width": this.state.columns * this.state.blockSize };
        return (
            <div onKeyUp={this.onKeyUp} >
                <div className='wrap'>

                    <div className='canvasBlock'>
                        <canvas className='FrontCanvas' style={style} ref={this.canvasFront}></canvas>
                        <canvas className='BackCanvas' style={style} ref={this.canvasBack}></canvas>

                    </div>
                    <div className='sideBlock'>
                        <canvas className='SideCanvas' style={style2} ref={this.canvasSide}></canvas>

                        <div>Rows Cleared: {this.state.score}</div>
                        <div>Score: {this.state.totalScore}</div>
                        <div className='buttonsBlock'>
                            <button onClick={this.startGame}>Start</button><br></br>
                        </div>
                    </div>
                </div>

            </div>
        )
    }
}

export default UniversalShapeContext