import React from 'react'
import {GAME_UPDATE, GAME_START, USER_READY} from './Events'
import { userInfo } from 'os';

class Canvas extends React.Component<
    { rows: number, reciever: string, setGeneratedShapes: any, columns: number, blockSize: number, rowScore: number, totalScore: number, startGame: any, canvasFront: any, canvasBack: any, canvasSide: any, socket: any, user: any },
    {start: boolean}> {
        constructor(props: any){
            super(props);
            this.state={
                start: false
            }
        }
    componentDidMount() {
        const { socket, canvasBack, canvasFront, canvasSide, rows, columns, blockSize, user, reciever, startGame } = this.props;
        socket.on(USER_READY, (generatedShapes: any)=>{
            this.props.setGeneratedShapes(generatedShapes);
        })
        console.log(user+" "+ reciever)
        socket.emit(GAME_START, {sender: user, reciever})
        if (canvasBack) {
            let c2: any = canvasBack.current;
            let c1: any = canvasFront.current;
            let c3: any = canvasSide.current;

            c1.width = columns * blockSize;
            c1.height = rows * blockSize;
            c2.width = columns * blockSize;
            c2.height = rows * blockSize;
            c3.width = columns * blockSize;
            c3.height = blockSize * 2;
            this.createGrid(c2.getContext('2d'));
        }
        socket.on(GAME_START, (bool: any)=>{
            console.log(bool)
        //    startGame();
            this.setState({
                start: bool
            })
        })
        if(this.state.start){
            
        }
    }
    createGrid = (ctx: any) => {
        const { rows, columns, blockSize } = this.props;
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#ccc';
        for (let i = 1; i < rows; i++) {
            ctx.beginPath()
            ctx.moveTo(0, i * blockSize);
            ctx.lineTo(columns * blockSize, i * blockSize);
            ctx.stroke();
        }
        for (let i = 1; i < columns; i++) {
            ctx.beginPath()
            ctx.moveTo(i * blockSize, 0);
            ctx.lineTo(i * blockSize, rows * blockSize);
            ctx.stroke();
        }
    }
   
    render() {

        const { rows, columns, blockSize, rowScore, totalScore, startGame, canvasFront, canvasBack, canvasSide } = this.props
        const style = { "height": rows * blockSize, "width": columns * blockSize };
        const style2 = { "height": blockSize * 2, "width": columns * blockSize };
        return (
            <div >

                <div className='canvasBlock'>
                    <canvas className='FrontCanvas' style={style} ref={canvasFront}></canvas>
                    <canvas className='BackCanvas' style={style} ref={canvasBack}></canvas>

                </div>
                <div className='sideBlock'>
                    <canvas className='SideCanvas' style={style2} ref={canvasSide}></canvas>

                    <div>Rows Cleared: {rowScore}</div>
                    <div>Score: {totalScore}</div>
                    {startGame ? <div className='buttonsBlock'>
                        <button onClick={startGame}>Start</button><br></br>
                    </div> : null }
                </div>
            </div>
        )
    }
}

export default Canvas