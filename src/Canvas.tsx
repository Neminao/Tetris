import React from 'react'

class Canvas extends React.Component<
    {
         rows: number,
        columns: number, blockSize: number, canvasFront: any,
        canvasBack: any, running? : boolean, isPlayerReady?: boolean
    },
    {}> {
    constructor(props: any) {
        super(props);
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    } 
    componentDidMount() {
        const { canvasBack, canvasFront, rows, columns, blockSize } = this.props;
        if (canvasBack) {
            let c2: any = canvasBack.current;          
            c2.width = columns * blockSize;
            c2.height = rows * blockSize;
            this.createGrid(c2.getContext('2d'));
        }
        if(canvasFront){
            let c1: any = canvasFront.current;
            c1.width = columns * blockSize;
            c1.height = rows * blockSize;
        }
        this.updateWindowDimensions();
        window.addEventListener('resize', this.updateWindowDimensions);
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.updateWindowDimensions);
    }


    updateWindowDimensions() {
        const { canvasBack, canvasFront, rows, columns, blockSize, running, isPlayerReady } = this.props;
        if(!running && isPlayerReady){
        if (canvasBack) {
            let c2: any = canvasBack.current;          
            c2.width = columns * blockSize;
            c2.height = rows * blockSize;
            this.createGrid(c2.getContext('2d'));
        }
        if(canvasFront){
            let c1: any = canvasFront.current;
            c1.width = columns * blockSize;
            c1.height = rows * blockSize;
        }
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
        const { rows, columns, blockSize, canvasFront, canvasBack } = this.props
        const style = { "height": rows * blockSize, "width": columns * blockSize };
        return (
            <div >

                <div className='canvasBlock'>
                    <canvas className='FrontCanvas' style={style} ref={canvasFront}></canvas>
                    <canvas className='BackCanvas' style={style} ref={canvasBack}></canvas>

                </div>

            </div>
        )
    }
}

export default Canvas