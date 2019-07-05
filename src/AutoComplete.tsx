import React from 'react';
import Canvas from './Canvas';
import UniversalShape from './UniversalShape';
import BaseBuildingSquare from './BaseBuildingSquare';
const { generateShapes } = require('./Factories')

interface AutoProps {
    rows: number, columns: number, blockSize: number, createEmptyMatrix: any, isRowComplete: any, isGameOver: any; createGrid: any;
}
interface AutoState {
    index: number, moveCounter: number, matrix: any[], generatedShapes: any[]
}

class AutoComplete extends React.Component<AutoProps, AutoState> {
    canvasBack = React.createRef<HTMLCanvasElement>();
    canvasFront = React.createRef<HTMLCanvasElement>();

    constructor(props: AutoProps) {
        super(props);
        let generatedShapes = this.setGeneratedShapes(generateShapes(1000, 7));
        let matrix = this.props.createEmptyMatrix(props.columns, props.rows)
        this.state = {
            index: 0,
            moveCounter: 0,
            matrix,
            generatedShapes
        }
    }

    componentDidMount = () => {
        // this.setState({ matrix: this.props.createEmptyMatrix(), generatedShapes: this.setGeneratedShapes(generateShapes(1000, 7)) })
        if (this.state.generatedShapes)
            this.autoMove();

    }

    setGeneratedShapes = (shapes: any) => {
        let generatedShapes = [];
        const { columns, rows, blockSize } = this.props;
        generatedShapes = shapes.map((elem: any) => {
            const color = elem.color;
            return new UniversalShape(elem.coords, columns, rows, 40, color);
        });
        return generatedShapes;
    }

    tempShape = (shape: UniversalShape): UniversalShape => {
        let coordinatesArr: any[] = [];

        shape.coordiantesArr.forEach((coords: any) => {
            let innerC: any[] = []
            coords.forEach((c: any) => {
                innerC.push({ y: c.y, x: c.x });
            })
            coordinatesArr.push(innerC);
        })
        let copy: UniversalShape = new UniversalShape(coordinatesArr, shape.columns, shape.rows, shape.size, shape.color);
        return copy;
    }

    isGameOver = (shape: any, matrix: any[]) => {
        return !shape.areBlocksFreeToMoveDown(matrix)
    }

    numberOfFilledFields = (matrix: any[], newMatrix: any[]) => {
        let counter = 0;
        let max: number, maxNew: number;
        for (let i = 0; i < matrix.length - 1; i++) {
            max = 0;
            maxNew = 0;
            matrix[i].forEach((element: any) => {
                if (element.status) max++;
            })
            newMatrix[i].forEach((element: any) => {
                if (element.status) maxNew++;
            })
            if (maxNew > max) {
                counter = counter + (maxNew - max) * i;
            }
        }
        return counter;
    }

    clearRow = (index: number) => {
        const { columns } = this.props;
        let mat = this.state.matrix;
        function x() {
            let sub: any[] = [];
            for (let j = 0; j < columns; j++) {
                sub.push({ status: false, color: 'white' });
            }
            return sub;
        }
        mat.splice(index, 1);
        mat.unshift(x());

        this.setState({
            matrix: mat
        })
    }

    autoMove = () => {
        const { index, matrix, generatedShapes } = this.state;
        const { columns, rows, isRowComplete, createGrid } = this.props;
        let shape: UniversalShape = generatedShapes[index];
        const bestShape = this.findBestPosition(shape);
        let rotation = 0;
        let canvas = this.canvasFront.current;
        let canvas2 = this.canvasBack.current;
        if (canvas && canvas2) {
            let ctx = canvas.getContext('2d');
            let ctx2 = canvas2.getContext('2d');
            let id = setInterval(() => {
                if (rotation < bestShape.rotation) {
                    shape.rotate();
                    rotation++;
                    if (ctx)
                        ctx.clearRect(0, 0, 2000, 2000)
                    if (shape)
                        shape.updateCanvas(ctx);
                }
                else if (bestShape.bestShape.blocksArr)
                    if (shape.blocksArr[0].left > bestShape.bestShape.blocksArr[0].left) {
                        if (shape.areBlocksFreeToMoveLeft(matrix)) {
                            shape.moveLeft();
                            if (ctx)
                                ctx.clearRect(0, 0, 2000, 2000)
                            shape.updateCanvas(ctx);
                        }
                    }
                    else if (shape && shape.blocksArr[0].left < bestShape.bestShape.blocksArr[0].left) {
                        if (shape.areBlocksFreeToMoveRight(matrix)) {
                            shape.moveRight();
                            if (ctx)
                                ctx.clearRect(0, 0, 2000, 2000)
                            shape.updateCanvas(ctx);
                        }
                    }
                    else {
                        if (shape && shape.areBlocksFreeToMoveDown(matrix)) {

                            if (ctx)
                                ctx.clearRect(0, 0, 2000, 2000);
                            shape.updateCanvas(ctx);
                            shape.moveDown();
                        }
                        else {
                            shape.moveBack();
                            shape.updateCanvas(ctx);
                            let newMatrix = this.addShapeToMatrix(bestShape.bestShape, matrix);
                            this.setState({ matrix: newMatrix, index: index + 1 })
                            if (isRowComplete(columns, rows, matrix).length > 0) {
                                isRowComplete(columns, rows, matrix).forEach((index: number) => {
                                    this.clearRow(index);
                                    if (ctx2)
                                        ctx2.clearRect(0, 0, 2000, 2000)
                                    createGrid(ctx2, columns, rows);
                                    this.fillCanvas(ctx2);
                                });
                            }
                            if (ctx2)
                                ctx2.clearRect(0, 0, 2000, 2000)
                            createGrid(ctx2, columns, rows);
                            this.fillCanvas(ctx2);
                            clearInterval(id);
                            this.autoMove();
                        }
                    }
            }, 50)
        }

    }

    fillCanvas = (ctx: any) => {
        const { matrix } = this.state;
        const { columns, rows, blockSize } = this.props;
        let temp: BaseBuildingSquare = new BaseBuildingSquare(0, 40, "red", 40)
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                if (matrix[i][j].status) {
                    temp.draw(j * 40, i * 40, ctx, matrix[i][j].color);
                }
            }
        }

    }

    copyBlocks = (blocks: BaseBuildingSquare[]): BaseBuildingSquare[] => {
        console.log(blocks)
        let topNegative = false;
        let leftNegative = false;
        for (let i = 0; i < 4; i++) {
            console.log(blocks[i])
            if (blocks[i].top < 0) topNegative = true;
            if (blocks[i].left < 0) leftNegative = true;
        }
        let temp: BaseBuildingSquare[] = blocks.map(block => {

            if (!topNegative && !leftNegative)
                return new BaseBuildingSquare(block.left, block.top, block.color, block.size);
            else return new BaseBuildingSquare(0, 0, block.color, block.size);
        })
        console.log(temp)
        return temp
    }

    findBestPosition = (shape: UniversalShape) => {
        const { rows, columns, blockSize, isRowComplete } = this.props;
        const { matrix } = this.state;
        let counter = columns;
        let max = 0;
        let rowsToClean = 0, rowNum;
        let bestShape: any = [];
        let arr = this.copyMatrix(matrix);
        let maxMoves = 0;
        let moved = 0;
        let rotation = 0;
        let rowCountSum: number = 0;
        let rowCountTemp: number = 0;

        if(shape)
        for (let j = 0; j < shape.coordiantesArr.length; j++) {
            let temp: UniversalShape = this.tempShape(shape);
            for (let i = 0; i < columns; i++) {
                temp = this.tempShape(shape);

                //if (temp.areBlocksFreeToRotate(matrix))
                    temp.setBlocks(shape.fillArr(shape.coordiantesArr[j], 40, columns));
                if (temp.areBlocksFreeToMoveRight(matrix)) {
                    while (temp.areBlockOutOfBoundsLeft()) temp.moveLeft();
                    //if (i != 0) {
                        for (let k = 0; k < i; k++)
                            temp.moveRight();
                   // }
                    moved = 0;
                    while (temp.areBlocksFreeToMoveDown(matrix)) {
                        temp.moveDown();
                        counter = temp.areBlocksFreeToMoveDownNumber(matrix);
                        moved++;

                    }
                    temp.moveBack();

                    arr = this.addShapeToMatrix(temp, arr);
                    rowCountTemp = this.numberOfFilledFields(matrix, arr);
                    console.log(rowCountTemp)
                    rowNum = isRowComplete(columns, rows, arr).length
                    if (this.isShapeAVerticalLine(temp)){
                        counter = 4;
                        console.log('vetical, counter: '+counter+" , rowNum:")
                        console.log(temp)
                    } 
                    if (rowNum > 0 && counter == 4) {
                        bestShape = temp;
                        rotation = j;
                        rowsToClean = rowNum;
                        console.log("row found")
                    }
                    else if (counter == 4) {
                        //if(!bestShape)
                        if (rowCountSum <= rowCountTemp) {

                            max = counter;

                            rowCountSum = rowCountTemp;
                            maxMoves = moved;
                            rotation = j;
                            bestShape = temp;
                        }

                    }
                    else if (max < counter) {

                        if (rowCountSum <= rowCountTemp) {

                            max = counter;

                            rowCountSum = rowCountTemp;
                            maxMoves = moved;
                            rotation = j;
                            bestShape = temp;
                        }
                    }
                    /*   else if (max < counter) {
                           if (rowCountSum <= rowCountTemp) {
   
                               max = counter;
   
                               rowCountSum = rowCountTemp;
                               maxMoves = moved;
                               rotation = j;
                               bestShape = temp;
                           }
                           else if (!bestShape) {
                               bestShape = temp;
                               rotation = j
                           }
                       }*/
                    /* rowCountSum = rowCountTemp;
                     bestShape = temp;
                     rotation = j;
                     }
                 
                else 
               */
                    /* if (rowNum > 0 && rowNum > rowsToClean) {
                            bestShape = temp;
                            rotation = j;
                            rowsToClean = rowNum;
                            console.log("row found")
                        }
                        else if(rowCountSum<rowCountTemp){
                            rowCountSum = rowCountTemp;
                        if ((max < counter || this.isShapeAVerticalLine(temp)) && rowsToClean == 0) {
                            if (this.isShapeAVerticalLine(temp) && max != 4) counter == 4;
                            max = counter;
                            
                            if (maxMoves - 1 <= moved && moved > 4) {
                                maxMoves = moved;
                                rotation = j;
                                bestShape = temp;
                            }
                        }
                            else if (!bestShape) {
                                bestShape = temp;
                                rotation = j
                            }
                        }*/
                    if (!bestShape) bestShape = temp;
                    arr = this.removeShapeFromMatrix(temp, arr);
                }
            }


        }

        return { bestShape, rotation }
    }

    getMatrixHeight = (columns: number, rows: number, matrix: any[]) => {
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                if (matrix[i][j].status) {
                    return rows - i;
                }
            }
        }
        return 0;
    }
    getColumnHeight = (columnIndex: number, rows: number, matrix: any[]) => {
        for (let i = 0; i < rows; i++) {

            if (matrix[i][columnIndex].status) {
                return rows - i;
            }

        }
        return 0;
    }



    isShapeAVerticalLine = (shape: UniversalShape) => {
        if (shape.blocksArr[0].left == shape.blocksArr[3].left && shape.blocksArr[0].left == shape.blocksArr[1].left && shape.blocksArr[0].left == shape.blocksArr[2].left) return true;
        else return false;
    }
    doesShapeNeedOneBlock = (shape: UniversalShape) => {
        if (
            shape.blocksArr[0].left == shape.blocksArr[3].left && shape.blocksArr[0].left == shape.blocksArr[1].left
        ) return true;
        else return false;
    }

    copyMatrix = (matrix: any[]) => {
        let newMatrix = matrix.map((row: any) => {
            return row.map((field: any) => {
                return { status: field.status, color: field.color };
            })
        });
        return newMatrix
    }

    addShapeToMatrix = (shape: UniversalShape, matrix: any[]) => {
        if (shape)
            shape.blocksArr.forEach((element: any) => {
                if (element && matrix) {
                    if (matrix[Math.round(element.top / shape.size)]) {
                        if (matrix[Math.round(element.top / shape.size)][Math.round(element.left / shape.size)]) {
                            matrix[Math.round(element.top / shape.size)][Math.round(element.left / shape.size)].status = true;
                            matrix[Math.round(element.top / shape.size)][Math.round(element.left / shape.size)].color = element.color;
                        }
                    }
                }
            });
        return matrix;
    }

    removeShapeFromMatrix = (shape: any, matrix: any[]) => {
        if (shape)
            shape.blocksArr.forEach((element: any) => {
                if (element && matrix) {
                    if (matrix[Math.round(element.top / shape.size)]) {
                        if (matrix[Math.round(element.top / shape.size)][Math.round(element.left / shape.size)]) {
                            matrix[Math.round(element.top / shape.size)][Math.round(element.left / shape.size)].status = false;
                            matrix[Math.round(element.top / shape.size)][Math.round(element.left / shape.size)].color = 'white';
                        }
                    }
                }
            });
        return matrix;
    }

    render() {
        const { rows, columns, blockSize } = this.props;
        return (
            <div>

                <Canvas rows={rows} columns={columns} blockSize={40} canvasBack={this.canvasBack} canvasFront={this.canvasFront} fixed={true} />
            </div>
        )
    }
}

export default AutoComplete