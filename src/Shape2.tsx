import BaseBuildingSquare from "./BaseBuildingSquare";
import Shape from "./Shape";
import Shape1 from "./Shape1";

class Shape2 implements Shape {
    shape1 = new BaseBuildingSquare(120, 0, 'blue');
    shape2 = new BaseBuildingSquare(160, 0, 'blue');
    shape3 = new BaseBuildingSquare(200, 0, 'blue');
    shape4 = new BaseBuildingSquare(240, 0, 'blue');
    top = 0;
    left = 120;
    right = 240;
    updateCanvas(ctx: any) {
        this.shape1.updateCanvas(ctx);
        this.shape2.updateCanvas(ctx);
        this.shape3.updateCanvas(ctx);
        this.shape4.updateCanvas(ctx);
    }
    moveDown() {
        if (this.top <= 760) {
            this.shape1.top += 40;
            this.shape2.top += 40;
            this.shape3.top += 40;
            this.shape4.top += 40;
            this.top += 40;
        }
    }
    moveRight() {
        if (!this.isShapeOutOfBoundsRight()) {
            this.shape1.left += 40;
            this.shape2.left += 40;
            this.shape3.left += 40;
            this.shape4.left += 40;
            this.left += 40;
            this.right += 40;
        }
    }
    isShapeOutOfBoundsLeft(){
        return this.shape1.left == 0;
    }
    isShapeOutOfBoundsRight(){
        return this.shape4.left == 360;
    }
    moveLeft() {
        if (!this.isShapeOutOfBoundsLeft()) {
            this.shape1.left -= 40;
            this.shape2.left -= 40;
            this.shape3.left -= 40;
            this.shape4.left -= 40;
            this.left -= 40;
            this.right -= 40;
        }
    }
    rotate() {
        if(this.shape1.top == this.shape4.top){
        this.shape1.left = this.shape3.left;
        this.shape2.left = this.shape3.left;
        this.shape4.left = this.shape3.left;
        this.shape1.top -= 80;
        this.shape2.top -= 40;
        this.shape4.top += 40;
        this.left -=40;
        this.right -=40;
        }
        else {
        this.shape1.top = this.shape3.top;
        this.shape2.top = this.shape3.top;
        this.shape4.top = this.shape3.top;
        this.shape1.left -= 80;
        this.shape2.left -= 40;
        this.shape4.left += 40;
        this.left +=40;
        this.right +=40;
        }
        if(this.shape1.left < 0 || this.shape2.left< 0){
            this.shape1.left = 0;
            this.shape2.left = 40;
            this.shape3.left = 80;
            this.shape4.left = 120;
        }
        else if (this.shape4.left > 360) {
            this.shape1.left = 240;
            this.shape2.left = 280;
            this.shape3.left = 320;
            this.shape4.left = 360;
        }
    }
    getAllSquares(): BaseBuildingSquare[] {
        let arr = [];
        arr.push(this.shape1);
        arr.push(this.shape2);
        arr.push(this.shape3);
        arr.push(this.shape4);
        return arr;
    }
    moveBack(): void {
        this.shape1.top -= 40;
        this.shape2.top -= 40;
        this.shape3.top -= 40;
        this.shape4.top -= 40;
    }
    areBlocksFreeToMoveLeft(matrix: any) {
        return this.shape1.isBlockFreeToMoveLeft(matrix) 
    }
    areBlocksFreeToMoveRight(matrix: any) {
        return this.shape4.isBlockFreeToMoveRight(matrix)
    }
    areBlocksFreeToMoveDown(matrix: any) {
        return this.shape4.isBlockFreeToMoveDown(matrix)
    }
    areBlocksFreeToRotate(matrix: any){
        return this.shape1.isBlockFreeToRotate(matrix) && this.shape2.isBlockFreeToRotate(matrix) &&
        this.shape3.isBlockFreeToRotate(matrix) && this.shape4.isBlockFreeToRotate(matrix);
     }
     
}

export default Shape2