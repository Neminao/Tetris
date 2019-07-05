import BaseBuildingSquare from "./BaseBuildingSquare";

class UniversalShape {
    coordiantesArr: any[];
    blocksArr: BaseBuildingSquare[];
    top: number;
    left: number;
    columns: number;
    rows: number;
    size: number;
    currentPosition: number;
    color: string;
    constructor(arr: any[], columns: number, rows: number, size: number, color: string) {
        this.coordiantesArr = arr

        this.top = 0;
        this.left = 0;
        this.rows = rows;
        this.columns = columns;
        this.size = size;
        this.currentPosition = 0;
        this.color = color;
        this.blocksArr = this.fillArr(arr[0], size, columns);
    }

    setBlocks = (blocks: any[]) => {
        this.blocksArr = blocks
    }

    fitToSide(move: number) {
        this.blocksArr = this.blocksArr.map((elem: any) => {
            return new BaseBuildingSquare((elem.left - move * this.size), elem.top , this.color, this.size)
        });
    }
    defineNewProperties(blocksArr: any[], scale: number, size: number) {
        this.blocksArr = blocksArr.map((elem: any) => {
            return new BaseBuildingSquare(Math.floor(elem.left / scale * size), Math.floor(elem.top / scale * size), 'red', this.size)
        });
    }
    fillArr(arr: any, size: number, columns: number): BaseBuildingSquare[] {
        let array: BaseBuildingSquare[] = [];
        arr.forEach((elem: any) => {
            array.push(new BaseBuildingSquare((elem.x + Math.floor(columns / 2) - 1) * size, elem.y * size, this.color, size))
        })
        return array;
    }
    moveDown() {
        this.blocksArr.forEach(elem => {
            elem.moveDown();
        })
        this.top += 1;
    }
    moveRight() {
        if (this.areBlockOutOfBoundsRight()) {
            this.blocksArr.forEach(elem => {
                elem.moveRight();
            })
            this.left += 1;
        }
    }
    moveLeft() {
        if (this.areBlockOutOfBoundsLeft()) {
            this.blocksArr.forEach(elem => {
                elem.moveLeft();
            })
            this.left -= 1;
        }
    }
    moveBack(): void {
        this.blocksArr.forEach(elem => {
            elem.moveBack();
        })
    }
    updateCanvas(ctx: any) {
        this.blocksArr.forEach(elem => {
            elem.updateCanvas(ctx, this.color);
        })
    }
    areBlocksFreeToMoveLeft(matrix: any) {
        let pom = true;
        this.blocksArr.forEach(elem => {
            if (!elem.isBlockFreeToMoveLeft(matrix)) {
                pom = false;
            }
        })
        return pom;
    }
    areBlocksFreeToMoveRight(matrix: any) {
        let pom = true;
        this.blocksArr.forEach(elem => {
            if (!elem.isBlockFreeToMoveRight(matrix)) {
                pom = false;
            }
        })
        return pom;
    }
    areBlocksFreeToMoveDown(matrix: any) {
        let pom = true;
        this.blocksArr.forEach(elem => {
            if (!elem.isBlockFreeToMoveDown(matrix)) {
                pom = false;
            }
        })
        return pom;
    }

    areBlocksFreeToMoveDownNumber(matrix: any) {
        let pom = 0;
        this.blocksArr.forEach(elem => {
            if (!elem.isBlockFreeToMoveDown(matrix)) {
                pom += 1;
            }
        })
        if(pom>0){
            if (this.blocksArr[0].left == this.blocksArr[3].left && this.blocksArr[0].left == this.blocksArr[1].left && this.blocksArr[0].left == this.blocksArr[2].left){
                pom == 4;
            }
            else if (this.blocksArr[0].left == this.blocksArr[3].left && this.blocksArr[0].left == this.blocksArr[1].left && this.blocksArr[0].top == this.blocksArr[2].top){
                pom += 2;
            }
            else if (this.blocksArr[0].top == this.blocksArr[3].top && this.blocksArr[0].top == this.blocksArr[1].top && this.blocksArr[0].left == this.blocksArr[2].left){
                pom+=1;
            }
            else if (this.blocksArr[0].top == this.blocksArr[2].top && this.blocksArr[0].top == this.blocksArr[1].top && this.blocksArr[2].left == this.blocksArr[3].left){
                pom+=1;
            }
            else if (this.blocksArr[0].left == this.blocksArr[2].left && this.blocksArr[0].left == this.blocksArr[1].left && this.blocksArr[2].top == this.blocksArr[3].top){
                pom+=2;
            }
            else if (this.blocksArr[0].left == this.blocksArr[2].left && this.blocksArr[0].left == this.blocksArr[1].left && this.blocksArr[1].top == this.blocksArr[3].top){
                pom+=2;
            }
            else if (this.blocksArr[0].top == this.blocksArr[2].top && this.blocksArr[0].top == this.blocksArr[1].top && this.blocksArr[1].left == this.blocksArr[3].left){
                pom+=1;
            }
            else if (this.blocksArr[0].left == this.blocksArr[2].left && this.blocksArr[1].left == this.blocksArr[3].left && this.blocksArr[0].top == this.blocksArr[1].top){
                pom+=2;
            }
            else if (this.blocksArr[0].left == this.blocksArr[2].left && this.blocksArr[1].left == this.blocksArr[3].left && this.blocksArr[0].top == this.blocksArr[1].top){
                pom+=2;
            }
            else if (this.blocksArr[0].left == this.blocksArr[1].left && this.blocksArr[2].left == this.blocksArr[3].left && this.blocksArr[0].top == this.blocksArr[2].top){
                pom+=2;
            }
            else if (this.blocksArr[0].left == this.blocksArr[1].left && this.blocksArr[2].left == this.blocksArr[3].left && this.blocksArr[0].top == this.blocksArr[2].top){
                pom+=2;
            }
        }
        return pom;
    }

    rotate() {
        let i = this.currentPosition;
        let blockStates = this.coordiantesArr
        if (i < blockStates.length - 1) {
            i += 1;
            this.blocksArr = this.fillArr(this.moveAdjustment(blockStates[i]), this.size, this.columns);
            this.currentPosition = i;
        }
        else {
            i = 0;
            this.blocksArr = this.fillArr(this.moveAdjustment(blockStates[i]), this.size, this.columns);
            this.currentPosition = i;
        }

    }
    moveAdjustment(blocksArr: any) {
        let arr: any[] = [];
        blocksArr.forEach((elem: any) => {
            arr.push({ x: elem.x + this.left, y: elem.y + this.top });
        })
        return arr;
    }
    areBlocksFreeToRotate(matrix: any) {
        let pom = true;
        this.blocksArr.forEach(elem => {
            if (!elem.isBlockFreeToRotate(matrix)) {
                pom = false;
            }
        })
        return pom;
    }
    areBlockOutOfBoundsLeft() {
        let pom = true;
        this.blocksArr.forEach(elem => {
            if (elem.left <= 0) {
                pom = false;
            }
        })
        return pom;
    }
    areBlockOutOfRotateBoundsLeft() {
        let pom = true;
        this.blocksArr.forEach(elem => {
            if (elem.left < 0) {
                pom = false;
            }
        })
        return pom;
    }
    areBlockOutOfBoundsRight() {
        let pom = true;
        this.blocksArr.forEach(elem => {
            if (elem.left >= (this.columns - 1) * this.size) {
                pom = false;
            }
        })
        return pom;
    }
    areBlockOutOfRotateBoundsRight() {
        let pom = true;
        this.blocksArr.forEach(elem => {
            if (elem.left > (this.columns - 1) * this.size) {
                pom = false;
            }
        })
        return pom;
    }
}

export default UniversalShape