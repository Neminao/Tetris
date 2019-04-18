import React from 'react'
import BaseBuildingSquare from './BaseBuildingSquare';
import Shape1 from './Shape1';

interface MyState {
    currentShape: any;
    nextShape: any;
    allBlocks: Shape1[];
    running: boolean;
    matrix: any[];
}
interface Map {
    [key: number]: number
}
class Wrapper extends React.Component<{}, MyState>{
    canvasBack = React.createRef<HTMLCanvasElement>();
    canvasFront = React.createRef<HTMLCanvasElement>();
    map: Map = {};
    constructor(props: {}) {
        super(props);

        this.state = {
            currentShape: null,
            nextShape: null,
            allBlocks: [],
            running: false,
            matrix: []
        }
    }
    createMap = () => {
        let i = 0;
        let map: Map = {
            0: i,
            1: i = i + 40,
            2: i = i + 40,
            3: i = i + 40,
            4: i = i + 40,
            5: i = i + 40,
            6: i = i + 40,
            7: i = i + 40,
            8: i = i + 40,
            9: i = i + 40,
            10: i = i + 40,
            11: i = i + 40,
            12: i = i + 40,
            13: i = i + 40,
            14: i = i + 40,
            15: i = i + 40,
            16: i = i + 40,
            17: i = i + 40,
            18: i = i + 40,
            19: i = i + 40,
        };

        return map;
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
    componentDidMount() {
        let c2: any = this.canvasBack.current;
        let c1: any = this.canvasFront.current;
        c1.width = 400;
        c1.height = 800;
        c2.width = 400;
        c2.height = 800;
        this.setState({
            matrix: this.createEmptyMatrix()
        })
        this.createGrid(c2.getContext('2d'));
        this.map = this.createMap();
        let i = 2;
        this.map[i];
        console.log(this.map[i])
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
    randomShape = () => {

    }
    startGame = () => {
        this.setState({
            running: true
        })
        this.run();

    }
    run = () => {
        let c1: any = this.canvasFront.current;
        const ctx1: any = c1.getContext('2d');
        const shape = new Shape1();
        ctx1.clearRect(0, 0, 400, 800);
        shape.updateCanvas(ctx1);
        this.setState({
            currentShape: shape
        })
        console.log(this.isRowComplete())
        let inter: any = setInterval(() => this.moveShape(shape, inter), 400);
    }
    moveShape = (shape: any, inter: any) => { // temp
        let c1: any = this.canvasFront.current;
        const ctx1: any = c1.getContext('2d');
        ctx1.clearRect(0, 0, 400, 800);
        shape.moveDown(this.getBorder());
        shape.updateCanvas(ctx1);
        if (this.state.matrix[shape.top / 40 + 1][shape.left / 40] || this.state.matrix[shape.top / 40 + 1][shape.right / 40]) {

            let arr = this.state.matrix;
            this.state.currentShape.getAllSquares().forEach((element: any) => {
                arr[element.top / 40][element.left / 40] = true;
            });
            this.setState({
                matrix: arr
            })
            this.updateStateOfTheGame(shape);
            console.log(arr);
            console.log(this.isRowComplete());
            clearInterval(inter);
            this.run();
        }

    }
    updateStateOfTheGame = (shape: any) => { // temp
        let c1: any = this.canvasBack.current;
        const ctx1: any = c1.getContext('2d');
        //this.state.currentShape.updateCanvas(ctx1);
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
        console.log(arr);
    }
    delay = (ms: number) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    isRowComplete = () => {
        const arr = this.state.matrix;
        for (let i = 0; i < 20; i++) {
            let counter = 0;
            arr[i].forEach((subEl: any) => {
                if (subEl) counter++;
            })
            if (counter == 10) {
                return i;
            }
        }
        return -1;
    }
    getBorder = () => { //temp
        let min = 800;

        if (this.state.allBlocks.length == 1) {
            min = this.state.allBlocks[0].top - 40
        } else
            for (let i = 0; i < this.state.allBlocks.length - 1; i++) {
                if (this.state.currentShape.left == this.state.allBlocks[i].left)
                    min = Math.min(this.state.allBlocks[i].top, this.state.allBlocks[i + 1].top) - 40;
                console.log(min)
            }
        return min;
    }
    handleMove = (event: any) => {
        if (this.state.running) {
            const id = event.target.id;
            let c1: any = this.canvasFront.current;
            const ctx1: any = c1.getContext('2d');
            let shape = this.state.currentShape;
            console.log(shape)
            const mat = this.state.matrix;

            if (id == 'right' && !this.state.matrix[shape.top / 40][shape.left / 40 +2]) {
                shape.moveRight();

            }
            else if (id == 'left' && !this.state.matrix[shape.top / 40][shape.left / 40 -1]) {
                shape.moveLeft();

            }


            ctx1.clearRect(0, 0, 400, 800);
            shape.updateCanvas(ctx1);
        }
    }
    render() {
        return (
            <div>
                <div className='canvasBlock'>
                    <canvas className='FrontCanvas'ref={this.canvasFront}></canvas>
                    <canvas className='BackCanvas' ref={this.canvasBack}></canvas>

                </div>
                <div className='buttonsBlock'>
                    <button onClick={this.startGame}>Start</button><br></br>
                    <button id='left' onClick={this.handleMove}>{'<-'}</button>
                    <button id='right' onClick={this.handleMove}>-></button>
                </div>
            </div>
        )
    }
}

export default Wrapper