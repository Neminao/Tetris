import BaseBuildingSquare from "./BaseBuildingSquare";

class Shape1 {
    shape1 = new BaseBuildingSquare(162, 2, 'blue');
    shape2 = new BaseBuildingSquare(202, 2, 'blue');
    shape3 = new BaseBuildingSquare(162, 42, 'blue');
    shape4 = new BaseBuildingSquare(202, 42, 'blue');
    top = 42;
    left = 162;
    updateCanvas(ctx: any) {
        this.shape1.updateCanvas(ctx);
        this.shape2.updateCanvas(ctx);
        this.shape3.updateCanvas(ctx);
        this.shape4.updateCanvas(ctx);
    }
    moveDown() {
        this.shape1.top += 40;
        this.shape2.top += 40;
        this.shape3.top += 40;
        this.shape4.top += 40;
        this.top += 40;
    }
    moveRight() {
        if(this.left<320){
        this.shape1.left += 40;
        this.shape2.left += 40;
        this.shape3.left += 40;
        this.shape4.left += 40;
        this.left += 40;
        }
    }
    moveLeft() {
        if(this.left>2){
        this.shape1.left -= 40;
        this.shape2.left -= 40;
        this.shape3.left -= 40;
        this.shape4.left -= 40;
        this.left -= 40;
        }
    }
}

export default Shape1