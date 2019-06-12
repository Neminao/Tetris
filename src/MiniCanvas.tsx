import React from 'react';

class MiniCanvas extends React.Component<{
    canvasSide: any, rowScore: number,
     totalScore: number, blockSize: number, columns: number,
      showSide: boolean, name: string
},{}> {

    componentDidMount(){
        const {canvasSide, columns, blockSize} = this.props;
        if (canvasSide != null) {
        let c3: any = canvasSide.current;
        if(c3){
            c3.width = columns / 2 * blockSize;
            c3.height = blockSize * 2;
        }
        }
    }
    render() {
        const {canvasSide, rowScore, totalScore, blockSize, columns, showSide, name} = this.props;
        const style2 = { "height": blockSize * 2, "width": columns / 2  * blockSize };      
        return (
            <div className='sideBlock'>
                    {showSide ? <canvas className='SideCanvas' style={style2} ref={canvasSide}></canvas> : null }
                    <div className={'score'}>
                    <table className={'infoTable'}>
                        <tbody>
                        <tr>
                            <td>User:</td><td className={'rightTD'}>{name}</td>
                        </tr>
                        <tr>
                            <td>Lines:</td><td className={'rightTD'}>{rowScore}</td>
                        </tr>
                        <tr>
                            <td>Score:</td><td className={'rightTD'}>{totalScore}</td>
                        </tr>
                        </tbody>
                    </table>
                    </div>
                </div>
        )
    }
}

export default MiniCanvas;