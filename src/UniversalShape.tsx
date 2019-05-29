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
    constructor(arr: any[], columns: number, rows: number, size: number) {
        this.coordiantesArr = arr
        this.blocksArr = this.fillArr(arr[0], size, columns);
        this.top = 0;
        this.left = 0;
        this.rows = rows;
        this.columns = columns;
        this.size = size;
        this.currentPosition = 0;
    }
    defineNewProperties(blocksArr: any[]){      
        this.blocksArr = blocksArr.map((elem: any) => {
            return new BaseBuildingSquare(elem.left, elem.top, 'red', this.size)
        });
        }
    fillArr(arr: any, size: number, columns: number): BaseBuildingSquare[] {
        let array: BaseBuildingSquare[] = [];
        arr.forEach((elem: any) => {
            array.push(new BaseBuildingSquare((elem.x + Math.floor(columns / 2) - 1) * size, elem.y * size, 'blue', size))
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
            elem.updateCanvas(ctx);
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
    rotate() {   
        let i = this.currentPosition;
        let blockStates = this.coordiantesArr
        if (i < blockStates.length -1 ) {
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