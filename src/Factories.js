
var uuidv4 = require("uuid/v4");
var shapeCoordinates = {
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
    0: [
        [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: -1, y: 1 }], [{ x: 0, y: 0 }, { x: 0, y: -1 }, { x: 1, y: 0 }, { x: 1, y: 1 }]
    ],
    1: [
        [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }], [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 0 }, { x: 1, y: -1 }]
    ],
    2: [
        [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 0 }], [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 0 }, { x: 0, y: -1 }],
        [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: -1 }, { x: -1, y: 0 }], [{ x: 0, y: 0 }, { x: 0, y: -1 }, { x: -1, y: 0 }, { x: 0, y: 1 }]
    ]
};
var colors = {
    0: 'OrangeRed', 
    1: 'blue',
    2: 'yellow',
    3: 'orange',
    4: 'GreenYellow',
    5: 'Aqua',
    6: 'DeepPink'

}
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
const generateShapes = (max) => { 
	let index = Math.floor(Math.random() * Math.floor(7));
	let array = [];
	for(var i = 0 ;i<max;i++){
		index = Math.floor(Math.random() * Math.floor(7));
		array.push({coords: shapeCoordinates[index], color: colors[index]});
		
	}
	return array;
}

module.exports = {
	createUser,
	createGameData,
	generateShapes
}
