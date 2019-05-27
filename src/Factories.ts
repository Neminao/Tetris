import uuidv4 from 'uuid/v4';

export const createUser = ({name = "", socketID = null, inGame = false, isReady = true} = {}) => ({
    id: uuidv4(),
    name,
		socketID,
		inGame,
		isReady
})


