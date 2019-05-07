import BaseBuildingSquare from "./BaseBuildingSquare";
import Shape from "./Shape";

class Shape9 implements Shape {
    
    shape1 = new BaseBuildingSquare(160, 0, 'blue');
    shape2 = new BaseBuildingSquare(200, 0, 'blue');
    
    top = 0;
    updateCanvas(ctx: any) {
        this.shape1.updateCanvas(ctx);
        this.shape2.updateCanvas(ctx);
    }
    moveDown() {
        if (this.top <= 760) {
            this.shape1.top += 40;
            this.shape2.top += 40;
            this.top += 40;
        }
    }
    moveRight() {
        if (!this.isShapeOutOfBoundsRight()) {
            this.shape1.left += 40;
            this.shape2.left += 40;
            
        }
    }
    isShapeOutOfBoundsLeft(){
        return this.shape1.left == 0;
    }
    isShapeOutOfBoundsRight(){
        return this.shape2.left == 360;
    }
    moveLeft() {
        if (!this.isShapeOutOfBoundsLeft()) {
            this.shape1.left -= 40;
            this.shape2.left -= 40;
        }
    }
    rotate() {
        if(this.shape1.top == this.shape2.top){
        this.shape1.left = this.shape2.left;
        this.shape1.top -= 40;
        }
        else {
        this.shape1.top = this.shape2.top;
        this.shape1.left -= 40;
        }
        if(this.shape1.left < 0 || this.shape2.left< 0){
            this.shape1.left = 0;
            this.shape2.left = 40;
        }
    }
    getAllSquares(): BaseBuildingSquare[] {
        let arr = [];
        arr.push(this.shape1);
        arr.push(this.shape2);
        return arr;
    }
    moveBack(): void {
        this.shape1.top -= 40;
        this.shape2.top -= 40;
    }
    areBlocksFreeToMoveLeft(matrix: any) {
        return this.shape1.isBlockFreeToMoveLeft(matrix) 
    }
    areBlocksFreeToMoveRight(matrix: any) {
        return this.shape2.isBlockFreeToMoveRight(matrix)
    }
    areBlocksFreeToMoveDown(matrix: any) {
        return this.shape1.isBlockFreeToMoveDown(matrix) && this.shape2.isBlockFreeToMoveDown(matrix) 
    }
    areBlocksFreeToRotate(matrix: any){
        return this.shape1.isBlockFreeToRotate(matrix) && this.shape2.isBlockFreeToRotate(matrix) 
     }
     
}

export default Shape9