import React from 'react'
import BaseBuildingSquare from './BaseBuildingSquare';
import Shape1 from './Shape1';
import Shape2 from './Shape2';
import Shape3 from './Shape3';
import Shape4 from './Shape4';
import Shape5 from './Shape5';
import Shape6 from './Shape6';
import Shape7 from './Shape7';
import Shape from './Shape';

interface MyState {
    currentShape: Shape;
    nextShape: Shape;
    allBlocks: Shape[];
    running: boolean;
    matrix: any[];
    score: number;
    speed: number;
    counterId: number;
}

class Wrapper extends React.Component<{}, MyState>{
    canvasBack = React.createRef<HTMLCanvasElement>();
    canvasFront = React.createRef<HTMLCanvasElement>();
    canvasSide = React.createRef<HTMLCanvasElement>();
    constructor(props: {}) {
        super(props);
        this.state = {
            currentShape: this.randomShape(),
            nextShape: this.randomShape(),
            allBlocks: [],
            running: false,
            matrix: [],
            score: 0,
            speed: 900,
            counterId: -1
        }
    }

    createEmptyMatrix = (): any[] => {
        let arr: any[] = [];
        function sub(): boolean[] {
            let sub: boolean[] = [];
            for (let j = 0; j < 10; j++) {
                sub.push(false);
            }
            return sub;
        }
        for (let i = 0; i < 20; i++) {
            arr.push(sub());
        }
        function x() {
            let sub: boolean[] = [];
            for (let j = 0; j < 10; j++) {
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
        c1.width = 400;
        c1.height = 800;
        c2.width = 400;
        c2.height = 800;
        c3.width = 400;
        c3.height = 80;
        this.setState({
            matrix: this.createEmptyMatrix()
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

            if (event.keyCode == 39 && shape.areBlocksFreeToMoveRight(mat)) {
                console.log(shape.areBlocksFreeToMoveRight(mat));
                shape.moveRight();

            }
            else if (event.keyCode == 37 && shape.areBlocksFreeToMoveLeft(mat)) {
                shape.moveLeft();

            }
            ctx1.clearRect(0, 0, 400, 800);
            shape.updateCanvas(ctx1);
        
        if (event.keyCode == 38) {
            this.handleRotate();
        }
        if (event.keyCode == 40) {
            this.setState({
                speed: 50
            })
            console.log(this.state.speed);
            clearInterval(this.state.counterId);
            let inter: any = setInterval(() => this.moveShape(shape, inter), this.state.speed);
        this.setState({
            counterId: inter
        })
        }
    }
    }
    onKeyUp = () => {
        this.setState({
            speed: 900
        })
    }
    createGrid = (ctx: any) => {
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#ccc';
        for (let i = 1; i < 20; i++) {
            ctx.beginPath()
            ctx.moveTo(0, i * 40);
            ctx.lineTo(400, i * 40);
            ctx.stroke();
        }
        for (let i = 1; i < 10; i++) {
            ctx.beginPath()
            ctx.moveTo(i * 40, 0);
            ctx.lineTo(i * 40, 800);
            ctx.stroke();
        }
    }

    randomShape = (): Shape => {
        switch (Math.floor(Math.random() * Math.floor(7))) {
            case 0: return new Shape1();
            case 1: return new Shape2();
            case 2: return new Shape3();
            case 3: return new Shape4();
            case 4: return new Shape5();
            case 5: return new Shape6();
            case 6: return new Shape7();
        }
        return new Shape1()
    }

    startGame = () => {
        this.setState({
            running: true
        })
        if (!this.state.running)
            this.run();
    }

    run = () => {
        let c1: any = this.canvasFront.current;
        const ctx1: any = c1.getContext('2d');
        const shape = this.randomShape();
        const next: Shape = this.deepCopyShape(this.state.nextShape);
        ctx1.clearRect(0, 0, 400, 800);
        const sidec: any = this.canvasSide.current;
        const sidectx = sidec.getContext('2d');
        sidectx.clearRect(0, 0, 400, 800);
        console.log(this.state.nextShape);
        console.log(next);
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
        let inter: any = setInterval(() => this.moveShape(next, inter), this.state.speed);
        this.setState({
            counterId: inter
        })
    }

    moveShape = (shape: any, inter: any) => { // temp
        let c1: any = this.canvasFront.current;

        const ctx1: any = c1.getContext('2d');
        ctx1.clearRect(0, 0, 400, 800);
        shape.moveDown();
        shape.updateCanvas(ctx1);
        let arr = this.state.matrix;
        if (!shape.areBlocksFreeToMoveDown(arr)) {
            this.state.currentShape.getAllSquares().forEach((element: any) => {
                arr[element.top / 40][element.left / 40] = true;
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

    updateStateOfTheGame = (shape: any) => { // temp
        let c1: any = this.canvasBack.current;
        const ctx1: any = c1.getContext('2d');
        if (this.isRowComplete().length > 0) {
            this.isRowComplete().forEach(index => {
                this.clearRow(index);
            });
            ctx1.clearRect(0, 0, 400, 800);
            this.createGrid(ctx1);
        }

        const shape1 = new BaseBuildingSquare(0, 0, 'blue')
        const mat = this.state.matrix;
        for (let i = 0; i < 20; i++) {
            for (let j = 0; j < 10; j++) {
                if (mat[i][j]) {
                    shape1.draw(j * 40, i * 40, ctx1);
                }
            }
        }
        let arr = this.state.allBlocks;
        arr.push(shape);
    }

    delay = (ms: number) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    clearRow = (index: number) => {
        let mat = this.state.matrix;
        console.log(mat);
        function x() {
            let sub: boolean[] = [];
            for (let j = 0; j < 10; j++) {
                sub.push(false);
            }
            return sub;
        }
        mat[index] = x();
        for (let i = index; i > 0; i--) {
            mat[i] = mat[i - 1];
        }
        let score = this.state.score;
        score += 1
        this.setState({
            matrix: mat,
            score: score
        })
    }

    isRowComplete = () => {
        const arr = this.state.matrix;
        let numArr = []
        for (let i = 0; i < 20; i++) {
            let counter = 0;
            arr[i].forEach((subEl: any) => {
                if (subEl) counter++;
            })
            if (counter == 10) {
                numArr.push(i);
            }
        }
        return numArr;
    }
    handleMove = (event: any) => {
        if (this.state.running) {
            const id = event.target.id;
            let c1: any = this.canvasFront.current;
            const ctx1: any = c1.getContext('2d');
            let shape = this.state.currentShape;
            const mat = this.state.matrix;

            if (id == 'right' && shape.areBlocksFreeToMoveRight(mat)) {
                console.log(shape.areBlocksFreeToMoveRight(mat));
                shape.moveRight();
            }
            else if (id == 'left' && shape.areBlocksFreeToMoveLeft(mat)) {
                shape.moveLeft();

            }
            ctx1.clearRect(0, 0, 400, 800);
            shape.updateCanvas(ctx1);
        }
    }

    handleRotate = () => {
        if (this.state.running) {
            let shape = this.state.currentShape;
            shape.rotate();
            this.setState({
                currentShape: shape
            })
            let c1: any = this.canvasFront.current;
            const ctx1: any = c1.getContext('2d');
            ctx1.clearRect(0, 0, 400, 800);
            shape.updateCanvas(ctx1);
        }
    }
    render() {
        return (
            <div onKeyUp={this.onKeyUp} >
                <div>
                    <canvas className='SideCanvas' ref={this.canvasSide}></canvas>
                </div>
                <div>{this.state.score}</div>
                <div className='canvasBlock'>
                    <canvas className='FrontCanvas' ref={this.canvasFront}></canvas>
                    <canvas className='BackCanvas' ref={this.canvasBack}></canvas>

                </div>

                <div className='buttonsBlock'>
                    <button onClick={this.startGame}>Start</button><br></br>
                    <button id='left' onClick={this.handleMove}>{'<-'}</button>
                    <button id='right' onClick={this.handleMove}>-></button>
                    <button id='rotate' onClick={this.handleRotate}>rotate</button>
                </div>
            </div>
        )
    }
}

export default Wrapper