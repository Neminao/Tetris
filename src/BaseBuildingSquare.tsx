class BaseBuildingSquare {
    left: number;
    top: number;
    color: string;
    constructor(left: number, top: number, color: string){
        this.left = left;
        this.top = top;
        this.color = color;
    }
    setTop(top:number){
        this.top = top;
    }
    updateCanvas(ctx: any){
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.left, this.top, 36, 36);

    }
}

export default BaseBuildingSquare