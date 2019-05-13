class BaseBuildingSquare {
    left: number;
    top: number;
    color: string;
    size: number
    constructor(left: number, top: number, color: string, size: number) {
        this.left = left;
        this.top = top;
        this.color = color;
        this.size = size
    }
    setTop(top: number) {
        this.top = top;
    }
    updateCanvas(ctx: any) {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.fillRect(this.left, this.top, this.size, this.size);
        ctx.rect(this.left, this.top, this.size, this.size);
        ctx.stroke();
    }
    draw(left: number, top: number, ctx: any) {
        ctx.beginPath();
        ctx.fillStyle = 'blue';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.fillRect(left, top, this.size, this.size);
        ctx.rect(left, top, this.size, this.size);
        ctx.stroke();
    }
    moveDown() {
        this.top += this.size;
    }
    moveBack() {
        this.top -= this.size;
    }
    moveLeft() {
        this.left -= this.size;
    }
    moveRight() {
        this.left += this.size;
    }
    isBlockFreeToMoveLeft(matrix: any) {
        return !matrix[Math.abs(this.top / this.size)][Math.abs(this.left / this.size - 1)]
    }
    isBlockFreeToMoveRight(matrix: any) {
        return !matrix[Math.abs(this.top / this.size)][Math.abs(this.left / this.size + 1)]
    }
    isBlockFreeToMoveDown(matrix: any) {
        return !(matrix[Math.abs(this.top / this.size)][this.left / this.size])
    }
    isBlockFreeToRotate(matrix: any) {
        return !(matrix[Math.abs(this.top / this.size)][Math.abs(this.left / this.size)])
    }
}

export default BaseBuildingSquare