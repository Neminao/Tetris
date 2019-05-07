import BaseBuildingSquare from "./BaseBuildingSquare";

interface Shape {
   /* shape1: BaseBuildingSquare;
    shape2: BaseBuildingSquare;
    shape3: BaseBuildingSquare;
    shape4: BaseBuildingSquare;*/
    top: number;
    updateCanvas(ctx: any): void;
    moveDown(): void;  
    moveRight(): void;
    moveLeft(): void;
    moveBack(): void;
    getAllSquares(): BaseBuildingSquare[];
    areBlocksFreeToMoveLeft(matrix: any[]): boolean;
    areBlocksFreeToMoveRight(matrix: any[]): boolean;
    areBlocksFreeToMoveDown(matrix: any[]): boolean;
    rotate(): void;
    [key: string]: any;
}

export default Shape