import React from 'react'
import BaseBuildingSquare from './BaseBuildingSquare';
import Shape1 from './Shape1';
import Shape2 from './Shape2';
import Shape3 from './Shape3';
import Shape4 from './Shape4';
import Shape5 from './Shape5';
import Shape6 from './Shape6';
import Shape7 from './Shape7';
import Shape8 from './Shape8';
import Shape from './Shape';
import Shape9 from './Shape9';
import Shape10 from './Shape10';
import Shape11 from './Shape11';
import UniversalShape from './UniversalShape';

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
}
interface ShapeInterface {
    [key: number]: Coordiantes[];
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
            currentShape: this.getRandomShape(),
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
            acceleration: 0
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
                //console.log(shape.areBlocksFreeToMoveRight(mat));
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
                        mat[element.top / 40][element.left / 40] = true;
                    });
                    this.setState({
                        matrix: mat
                    })
                    this.updateStateOfTheGame(shape);
                    // console.log(arr);

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

    /* randomShape = (): Shape => {
         switch (Math.floor(Math.random() * Math.floor(11))) {
             case 0: return new Shape1();
             case 1: return new Shape2();
             case 2: return new Shape3();
             case 3: return new Shape4();
             case 4: return new Shape5();
             case 5: return new Shape6();
             case 6: return new Shape7();
             case 7: return new Shape8();
             case 8: return new Shape9();
             case 9: return new Shape10();
             case 10: return new Shape11();
         }
         return new Shape1()
     }*/

    getRandomShape = (): UniversalShape => {
        let index = Math.floor(Math.random() * Math.floor(10))
        let shapes: ShapeInterface = {
            0: [{ x: 0, y: 0 }],
            1: [{ x: 0, y: 0 }, { x: 1, y: 0 }],
            2: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: -1, y: 0 }],
            3: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: -1, y: 0 }, { x: -2, y: 0 }],
            4: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: -1, y: 0 }, { x: -1, y: 1 }],
            5: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: -1, y: 0 }, { x: 1, y: 1 }],
            6: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }],
            7: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 1 }],
            8: [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }],
            9: [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 0 }],
        };
        return new UniversalShape(shapes[index]);
    }

    startGame = () => {
        this.setState({
            running: true
        })
        if (!this.state.running)
            this.run();
    }


    run = () => {
        let acc = this.state.acceleration;
        this.setState({
            baseDelay: 20 - acc
        })
        let c1: any = this.canvasFront.current;
        const ctx1: any = c1.getContext('2d');
        const shape = this.getRandomShape();
        const next: UniversalShape = this.deepCopyShape(this.state.nextShape);
        ctx1.clearRect(0, 0, 400, 800);
        const sidec: any = this.canvasSide.current;
        const sidectx = sidec.getContext('2d');
        sidectx.clearRect(0, 0, 400, 800);
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
            ctx1.clearRect(0, 0, 400, 800);
            shape.moveDown();
            if (shape.areBlocksFreeToMoveDown(arr))
                shape.updateCanvas(ctx1);

            if (!shape.areBlocksFreeToMoveDown(arr)) {
                this.state.currentShape.moveBack();
                this.state.currentShape.blocksArr.forEach((element: any) => {
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
        //console.log(pom);
        return pom;
    }

    delay = (ms: number) => {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    clearRow = (index: number) => {
        let mat = this.state.matrix;
        //  console.log(mat);
        function x() {
            let sub: boolean[] = [];
            for (let j = 0; j < 10; j++) {
                sub.push(false);
            }
            return sub;
        }
        mat.splice(index, 1);
        mat.unshift(x());
        /*  for (let i = index; i > 0; i--) {
              mat[i] = mat[i - 1];
          }*/
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
                //console.log(shape.areBlocksFreeToMoveRight(mat));
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
                ctx1.clearRect(0, 0, 400, 800);
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
        return (
            <div onKeyUp={this.onKeyUp} >
                <div className='wrap'>

                    <div className='canvasBlock'>
                        <canvas className='FrontCanvas' ref={this.canvasFront}></canvas>
                        <canvas className='BackCanvas' ref={this.canvasBack}></canvas>

                    </div>
                    <div className='sideBlock'>
                        <canvas className='SideCanvas' ref={this.canvasSide}></canvas>

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