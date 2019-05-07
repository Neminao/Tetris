import BaseBuildingSquare from "./BaseBuildingSquare";
import Shape from "./Shape";
class Shape8 implements Shape {
    shape1 = new BaseBuildingSquare(160, 0, 'blue');
    top = 0;
    updateCanvas(ctx: any) {
        this.shape1.updateCanvas(ctx);
    }
    moveDown() {
        if (this.top <= 760) {
            this.shape1.top += 40;
            this.top += 40;
        }
    }
    isShapeOutOfBoundsLeft() {
        return this.shape1.left == 0;
    }
    isShapeOutOfBoundsRight() {
        return this.shape1.left == 360;
    }
    moveRight() {
        if (!this.isShapeOutOfBoundsRight()) {
            this.shape1.left += 40;
        }
    }
    moveLeft() {
        if (!this.isShapeOutOfBoundsLeft()) {
            this.shape1.left -= 40;
        }
    }
    getAllSquares(): BaseBuildingSquare[] {
        let arr = [];
        arr.push(this.shape1);
        return arr;
    }
    moveBack(): void {
        this.shape1.top -= 40;
    }
    areBlocksFreeToMoveLeft(matrix: any) {
        return this.shape1.isBlockFreeToMoveLeft(matrix);
    }
    areBlocksFreeToMoveRight(matrix: any) {
        return this.shape1.isBlockFreeToMoveRight(matrix) ;
    }
    areBlocksFreeToMoveDown(matrix: any) {
        return this.shape1.isBlockFreeToMoveDown(matrix);
    }
    rotate() { }
    areBlocksFreeToRotate(matrix: any) {
        return this.shape1.isBlockFreeToRotate(matrix);
    }
}

export default Shape8