class BaseBuildingSquare {
    left: number;
    top: number;
    color: string;
    constructor(left: number, top: number, color: string) {
        this.left = left;
        this.top = top;
        this.color = color;
    }
    setTop(top: number) {
        this.top = top;
    }
    updateCanvas(ctx: any) {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.fillRect(this.left, this.top, 40, 40);
        ctx.rect(this.left, this.top, 40, 40);
        ctx.stroke();
    }
    draw(left: number, top: number, ctx: any) {
        ctx.beginPath();
        ctx.fillStyle = 'blue';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.fillRect(left, top, 40, 40);
        ctx.rect(left, top, 40, 40);
        ctx.stroke();
    }
    isBlockFreeToMoveLeft(matrix: any) {
        return !matrix[this.top / 40][this.left / 40 - 1]
    }
    isBlockFreeToMoveRight(matrix: any) {
        return !matrix[this.top / 40][this.left / 40 + 1]
    }
    isBlockFreeToMoveDown(matrix: any) {
        return !matrix[this.top / 40 + 1][this.left / 40]
    }
}

export default BaseBuildingSquare