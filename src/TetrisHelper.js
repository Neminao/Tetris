

function createEmptyMatrix (col, row) {
    let arr = [];
    function sub() {
        let sub = [];
        for (let j = 0; j < col; j++) {
            sub.push({ status: false, color: 'white' });
        }
        return sub;
    }
    for (let i = 0; i < row; i++) {
        arr.push(sub());
    }
    function x() {
        let sub = [];
        for (let j = 0; j < col; j++) {
            sub.push({ status: true, color: 'black' });
        }
        return sub;
    }
    arr.push(x())
    return arr;
}

 function isRowComplete (col, row, arr) {
    let numArr = []
    for (let i = 0; i < row; i++) {
        let counter = 0;
        arr[i].forEach((subEl) => {
            if (subEl.status) counter++;
        })
        if (counter === col) {
            numArr.push(i);
        }
    }
    return numArr;
}

 function isGameOver (shape, matrix) {
    return !shape.areBlocksFreeToMoveDown(matrix)
}

 function createGrid (ctx, col, row, size, scale) {
    if (scale) size = size / 2;
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#ccc';
    for (let i = 1; i < row; i++) {
        ctx.beginPath()
        ctx.moveTo(0, i * size);
        ctx.lineTo(col * size, i * size);
        ctx.stroke();
    }
    for (let i = 1; i < col; i++) {
        ctx.beginPath()
        ctx.moveTo(i * size, 0);
        ctx.lineTo(i * size, row * size);
        ctx.stroke();
    }
}

module.exports = {
	createEmptyMatrix,
	isGameOver,
    isRowComplete,
    createGrid
}