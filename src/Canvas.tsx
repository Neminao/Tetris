import React from 'react'

class Canvas extends React.Component<
    {
        showSide: boolean, rows: number,
        columns: number, blockSize: number,
        rowScore: number, totalScore: number, canvasFront: any,
        canvasBack: any, canvasSide: any
    },
    {}> {
    constructor(props: any) {
        super(props);
    }
    componentDidMount() {
        const { canvasBack, canvasFront, canvasSide, rows, columns, blockSize } = this.props;
        if (canvasBack) {
            let c2: any = canvasBack.current;
            let c1: any = canvasFront.current;
            let c3: any = canvasSide.current;

            c1.width = columns * blockSize;
            c1.height = rows * blockSize;
            c2.width = columns * blockSize;
            c2.height = rows * blockSize;
            if (null != c3) {
                c3.width = columns * blockSize;
                c3.height = blockSize * 2;
            }
            this.createGrid(c2.getContext('2d'));
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

        const { rows, columns, blockSize, rowScore, totalScore, canvasFront, canvasBack, canvasSide, showSide } = this.props
        const style = { "height": rows * blockSize, "width": columns * blockSize };
        const style2 = { "height": blockSize * 2, "width": columns * blockSize };
        return (
            <div >

                <div className='canvasBlock'>
                    <canvas className='FrontCanvas' style={style} ref={canvasFront}></canvas>
                    <canvas className='BackCanvas' style={style} ref={canvasBack}></canvas>

                </div>

                <div className='sideBlock'>
                    {showSide ? <canvas className='SideCanvas' style={style2} ref={canvasSide}></canvas> : null }

                    <div>Rows Cleared: {rowScore}</div>
                    <div>Score: {totalScore}</div>

                </div>
            </div>
        )
    }
}

export default Canvas