import BaseBuildingSquare from "./BaseBuildingSquare";

class UniversalShape {
    coordiantesArr: any;
    blocksArr: BaseBuildingSquare[];
    top: number;
    constructor(arr: any){
        this.coordiantesArr = arr
        this.blocksArr = this.fillArr(arr);
        this.top = 40;
    }
    fillArr(arr: any): BaseBuildingSquare[]{
        let array: BaseBuildingSquare[] = [];
        arr.forEach((elem: any) => {
            array.push(new BaseBuildingSquare((elem.x+3)*40, elem.y*40, 'blue'))
        })
        return array;
    }
    moveDown(){
        if(this.top<=800){
       // if(this.areBlocksFreeToMoveDown(matrix)){
            this.blocksArr.forEach(elem => {
                elem.moveDown();
            })
           // this.top += 40;
        }
       // }
    }
    moveRight(){
        // if(this.areBlocksFreeToMoveDown(matrix)){
             this.blocksArr.forEach(elem => {
                 elem.moveRight();
             })
        // }
     }
     moveLeft(){
        // if(this.areBlocksFreeToMoveDown(matrix)){
             this.blocksArr.forEach(elem => {
                 elem.moveLeft();
             })
        // }
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
            if(!elem.isBlockFreeToMoveLeft(matrix)){
                pom = false;
            }
        })
        return pom;
    }
    areBlocksFreeToMoveRight(matrix: any) {
        let pom = true;
        this.blocksArr.forEach(elem => {
            if(!elem.isBlockFreeToMoveRight(matrix)){
                pom = false;
            }
        })
        return pom;
    }
    areBlocksFreeToMoveDown(matrix: any) {
        let pom = true;
        this.blocksArr.forEach(elem => {
            if(!elem.isBlockFreeToMoveDown(matrix)){
                pom = false;
            }
        })
        return pom;
    }
    rotate() {
        this.coordiantesArr.forEach((elem: any) => {
            const pom = elem.x;
            elem.x = elem.y;
            elem.y = - pom;
        })
        this.blocksArr = this.fillArr(this.coordiantesArr);
        this.moveDown();
        this.moveDown();
        this.moveDown();
        this.moveDown();
     }
    areBlocksFreeToRotate(matrix: any) {
        let pom = true;
        this.blocksArr.forEach(elem => {
            if(!elem.isBlockFreeToRotate(matrix)){
                pom = false;
            }
        })
        return pom;
    }
}

export default UniversalShape