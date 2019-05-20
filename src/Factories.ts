import uuidv4 from 'uuid/v4';

export const createUser = ( name: string) => ({
    id: uuidv4(),
    name: name
})
