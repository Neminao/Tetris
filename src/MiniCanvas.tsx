import React from 'react';

class MiniCanvas extends React.Component<{
    canvasSide: any, rowScore: number,
     totalScore: number, blockSize: number, columns: number,
      showSide: boolean, name: string
},{}> {

    componentDidMount(){
        const {canvasSide, columns, blockSize} = this.props;
        let c3: any = canvasSide.current;
        if (null != c3) {
            c3.width = columns * blockSize;
            c3.height = blockSize * 2;
        }
    }
    render() {
        const {canvasSide, rowScore, totalScore, blockSize, columns, showSide, name} = this.props;
        const style2 = { "height": blockSize * 2, "width": columns * blockSize };      
        return (
            <div className='sideBlock'>
                    {showSide ? <canvas className='SideCanvas' style={style2} ref={canvasSide}></canvas> : null }
                    <div className={'score'}>
                    <div>User: {name}</div>
                    <div>Rows Cleared: {rowScore}</div>
                    <div>Score: {totalScore}</div>
                    </div>
                </div>
        )
    }
}

export default MiniCanvas;