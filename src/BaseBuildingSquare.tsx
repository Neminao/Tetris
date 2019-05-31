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
    updateCanvas(ctx: any, color?: string) {
        
        ctx.fillStyle = this.color;
        if(color) ctx.fillStyle = color;
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.fillRect(this.left, this.top, this.size, this.size);
        ctx.rect(this.left, this.top, this.size, this.size);
        ctx.stroke();
    }
    draw(left: number, top: number, ctx: any, color: string) {
        ctx.beginPath();
        ctx.fillStyle = color;
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
        return !matrix[Math.abs(this.top / this.size)][Math.abs(this.left / this.size - 1)].status;
    }
    isBlockFreeToMoveRight(matrix: any) {
        let pom = false;
        if(null != matrix[Math.abs(this.top / this.size)][Math.abs(this.left / this.size + 1)])
        if(!matrix[Math.abs(this.top / this.size)][Math.abs(this.left / this.size + 1)].status) pom = true;
        return pom;
    }
    isBlockFreeToMoveDown(matrix: any) {
        return !(matrix[Math.abs(this.top / this.size)][this.left / this.size].status)
    }
    isBlockFreeToRotate(matrix: any) {
        return !(matrix[Math.abs(this.top / this.size)][Math.abs(this.left / this.size)].status)
    }
}

export default BaseBuildingSquare