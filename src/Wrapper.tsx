import React from 'react'
import BaseBuildingSquare from './BaseBuildingSquare';
import { delay, async } from 'q';
import { resolve } from 'url';
import Shape1 from './Shape1';

interface MyState {
    currentShape: any;
    nextShape: any;
    allBlocks: BaseBuildingSquare[];
}
class Wrapper extends React.Component<{}, MyState>{
    canvasBack = React.createRef<HTMLCanvasElement>();
    canvasFront = React.createRef<HTMLCanvasElement>();
    constructor(props: {}) {
        super(props);
        this.state = {
            currentShape: null,
            nextShape: null,
            allBlocks: []
        }
    }
    componentDidMount() {
        let c2: any = this.canvasBack.current;
        let c1: any = this.canvasFront.current;
        c1.width = 400;
        c1.height = 800;
        c2.width = 400;
        c2.height = 800;
    }
    randomShape = () => {

    }
    startGame = () => {
        let c1: any = this.canvasFront.current;
        const ctx1: any = c1.getContext('2d');
        const shape = new Shape1();
        ctx1.clearRect(0, 0, 400, 800);
        shape.updateCanvas(ctx1);
        this.setState({
            currentShape: shape
        })
        let inter: any = setInterval(() => this.moveShape(shape, inter), 1000);
    }
    moveShape = (shape: any, inter: any) => {
        let c1: any = this.canvasFront.current;
        const ctx1: any = c1.getContext('2d');
        ctx1.clearRect(0, 0, 400, 800);
        shape.moveDown();
        shape.updateCanvas(ctx1);
        if (shape.top > 762) {
            this.updateStateOfTheGame(shape);
            clearInterval(inter);
            this.startGame();
        }

    }
    updateStateOfTheGame = (shape: any) => {
        let c1: any = this.canvasBack.current;
        const ctx1: any = c1.getContext('2d');
        this.state.currentShape.updateCanvas(ctx1);
        console.log(this.state.currentShape);
    }
    delay = (ms: number) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    handleMove = (event: any) => {
        const id = event.target.id;
        let c1: any = this.canvasFront.current;
        const ctx1: any = c1.getContext('2d');
        let shape = this.state.currentShape;
        if (id == 'right') {
            shape.moveRight();

        }
        else if (id == 'left') {
            shape.moveLeft();

        }
        ctx1.clearRect(0, 0, 400, 800);
        shape.updateCanvas(ctx1);
    }
    render() {
        return (
            <div>
                <div className='canvasBlock'>
                    <canvas ref={this.canvasFront}></canvas>
                    <canvas ref={this.canvasBack}></canvas>

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