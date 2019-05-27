
var uuidv4 = require("uuid/v4");
var shapeCoordinates = {
    0: [
        [{ x: 0, y: 0 }]
    ],
    1: [
        [{ x: 0, y: 0 }, { x: 1, y: 0 }], [{ x: 0, y: 0 }, { x: 0, y: 1 }]
    ],
    2: [
        [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: -1, y: 0 }], [{ x: 0, y: 0 }, { x: 0, y: -1 }, { x: 0, y: 1 }]
    ],
    3: [
        [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: -1, y: 0 }, { x: 2, y: 0 }], [{ x: 0, y: 0 }, { x: 0, y: -1 }, { x: 0, y: -2 }, { x: 0, y: 1 }]
    ],
    4: [
        [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: -1, y: 0 }, { x: -1, y: 1 }], [{ x: 0, y: 0 }, { x: 0, y: -1 }, { x: 0, y: 1 }, { x: 1, y: 1 }],
        [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: 1, y: 0 }, { x: 1, y: -1 }], [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }, { x: -1, y: -1 }]
    ],
    5: [
        [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: -1, y: 0 }, { x: 1, y: 1 }], [{ x: 0, y: 0 }, { x: 0, y: -1 }, { x: 0, y: 1 }, { x: 1, y: -1 }],
        [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: 1, y: 0 }, { x: -1, y: -1 }], [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: -1 }, { x: -1, y: 1 }]
    ],
    6: [
        [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }]
    ],
    7: [
        [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 1 }], [{ x: 0, y: 0 }, { x: 0, y: -1 }, { x: 1, y: 0 }, { x: 1, y: 1 }]
    ],
    8: [
        [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }], [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 0 }, { x: 1, y: -1 }]
    ],
    9: [
        [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 0 }], [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 0 }, { x: 0, y: -1 }],
        [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: -1 }, { x: -1, y: 0 }], [{ x: 0, y: 0 }, { x: 0, y: -1 }, { x: -1, y: 0 }, { x: 0, y: 1 }]
    ]
};
const createUser = ({name = "", socketID = null, inGame = false, isReady = false} = {})=>(
	{
		id:uuidv4(),
		name,
		socketID,
		inGame,
		isReady
	}
)

const createGameData = ({matrix = []} = {})=>(
	{
		matrix	
	}
)
const generateShapes = () => {
	let index = Math.floor(Math.random() * Math.floor(10));
	let array = [];
	for(var i = 0 ;i<1000;i++){
		index = Math.floor(Math.random() * Math.floor(10));
		array.push(shapeCoordinates[index]);
		
	}
	return array;
}

module.exports = {
	createUser,
	createGameData,
	generateShapes
}
