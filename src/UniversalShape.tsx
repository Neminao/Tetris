import BaseBuildingSquare from "./BaseBuildingSquare";

class UniversalShape {
    coordiantesArr: any[];
    blocksArr: BaseBuildingSquare[];
    top: number;
    left: number;
    constructor(arr: any) {
        this.coordiantesArr = arr
        this.blocksArr = this.fillArr(arr);
        this.top = 0;
        this.left = 0;
    }
    fillArr(arr: any): BaseBuildingSquare[] {
        let array: BaseBuildingSquare[] = [];
        arr.forEach((elem: any) => {
            array.push(new BaseBuildingSquare((elem.x + 4) * 40, elem.y * 40, 'blue'))
        })
        return array;
    }
    moveDown() {
        if (this.top <= 20) {
            // if(this.areBlocksFreeToMoveDown(matrix)){
            this.blocksArr.forEach(elem => {
                elem.moveDown();
            })
            this.top += 1;
        }
        // }
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
        let pom = true;
        for (let i = 0; i < this.coordiantesArr.length - 1; i++) {
            if (this.coordiantesArr[i].x != this.coordiantesArr[i + 1].x) {
                pom = false;
            }
        }
        if (pom) {
            this.coordiantesArr.forEach((elem: any) => {
                const pom = elem.x;
                elem.x = - elem.y;
                elem.y = - pom;
            })
        }
        else
            this.coordiantesArr.forEach((elem: any) => {
                const pom = elem.x;
                elem.x = elem.y;
                elem.y = - pom;
            })
        this.blocksArr = this.fillArr(this.moveAdjustment());
        console.log(this.left)
    }
    moveAdjustment() {
        let arr: any[] = [];
        this.coordiantesArr.forEach(elem => {
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
    areBlockOutOfBoundsLeft(){
        let pom = true;
        this.blocksArr.forEach(elem => {
            if(elem.left<=0){
                pom = false;
            }
        })
        return pom;
    }
    areBlockOutOfRotateBoundsLeft(){
        let pom = true;
        this.blocksArr.forEach(elem => {
            if(elem.left<0){
                pom = false;
            }
        })
        return pom;
    }
    areBlockOutOfBoundsRight(){
        let pom = true;
        this.blocksArr.forEach(elem => {
            if(elem.left>=360){
                pom = false;
            }
        })
        return pom;
    }
    areBlockOutOfRotateBoundsRight(){
        let pom = true;
        this.blocksArr.forEach(elem => {
            if(elem.left>360){
                pom = false;
            }
        })
        return pom;
    }
}

export default UniversalShape