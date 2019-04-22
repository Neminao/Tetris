import BaseBuildingSquare from "./BaseBuildingSquare";
import Shape from "./Shape";

class Shape6 implements Shape {
    shape2 = new BaseBuildingSquare(200, 0, 'blue');
    shape3 = new BaseBuildingSquare(240, 0, 'blue');
    shape1 = new BaseBuildingSquare(160, 0, 'blue');
    shape4 = new BaseBuildingSquare(240, 40, 'blue');
    top = 40;
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
        }
    }
    moveLeft() {
        if (!this.isShapeOutOfBoundsLeft()) {
            this.shape1.left -= 40;
            this.shape2.left -= 40;
            this.shape3.left -= 40;
            this.shape4.left -= 40;
        }
    }

    rotate() {
        console.log(this.shape1.top + ' ' + this.shape2.top + ' ' + this.shape3.top)
        if (this.shape1.top == this.shape2.top && this.shape2.top == this.shape3.top) {

            this.shape1.left = this.shape2.left;
            this.shape1.top += 80;
            this.shape2.left = this.shape3.left;
            this.shape2.top = this.shape1.top;
        }
        else if (this.shape3.left == this.shape4.left && this.shape4.left == this.shape2.left) {
            this.shape3.top = this.shape4.top;
            this.shape3.left -= 80;
            this.shape4.top = this.shape1.top;
            this.shape4.left = this.shape3.left;

        }
        else if (this.shape4.top == this.shape1.top && this.shape1.top == this.shape2.top) {
            this.shape3.left = this.shape1.left;
            this.shape3.top += 80;
            this.shape4.left = this.shape1.left;
            this.shape4.top += 80;
        }
        else {
            this.shape4.top = this.shape3.top;
            this.shape3.top = this.shape1.top;
            this.shape3.left += 80;
            this.shape4.left = this.shape3.left;
        }
        if (this.shape3.left < 0) {
            this.shape3.left = 0;
            this.shape4.left = 0;
            this.shape1.left = 40;
            this.shape2.left = 80;
        }
        if (this.shape3.left > 360) {
            this.shape3.left = 360;
            this.shape4.left = 360;
            this.shape2.left = 320;
            this.shape1.left = 280;
        }
    }
    isShapeOutOfBoundsLeft() {
        return this.shape1.left == 0 || this.shape2.left == 0 || this.shape3.left == 0 || this.shape4.left == 0;
    }
    isShapeOutOfBoundsRight() {
        return this.shape1.left == 360 || this.shape2.left == 360 || this.shape3.left == 360 || this.shape4.left == 360;
    }
    getAllSquares(): BaseBuildingSquare[] {
        let arr = [];
        arr.push(this.shape1);
        arr.push(this.shape2);
        arr.push(this.shape3);
        arr.push(this.shape4);
        return arr;
    }
    areBlocksFreeToMoveLeft(matrix: any) {
        return this.shape1.isBlockFreeToMoveLeft(matrix) && this.shape2.isBlockFreeToMoveLeft(matrix) &&
            this.shape3.isBlockFreeToMoveLeft(matrix) && this.shape4.isBlockFreeToMoveLeft(matrix)
    }
    areBlocksFreeToMoveRight(matrix: any) {
        return this.shape1.isBlockFreeToMoveRight(matrix) && this.shape2.isBlockFreeToMoveRight(matrix) &&
            this.shape3.isBlockFreeToMoveRight(matrix) && this.shape4.isBlockFreeToMoveRight(matrix)
    }
    areBlocksFreeToMoveDown(matrix: any) {
        return this.shape1.isBlockFreeToMoveDown(matrix) && this.shape2.isBlockFreeToMoveDown(matrix) &&
            this.shape3.isBlockFreeToMoveDown(matrix) && this.shape4.isBlockFreeToMoveDown(matrix)
    }
}

export default Shape6