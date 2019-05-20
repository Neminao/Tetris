
var uuidv4 = require("uuid/v4");

const createUser = ({name = "", socketID = null} = {})=>(
	{
		id:uuidv4(),
		name,
		socketID
	}
)

const createGameData = ({matrix = []} = {})=>(
	{
		matrix	
	}
)

module.exports = {
	createUser,
	createGameData
}
