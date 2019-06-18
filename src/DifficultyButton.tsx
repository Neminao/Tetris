import React from 'react';

function DifficultyButton(props: any) {

    return (
                    
            <label className="container">
                <input
                    type="radio"
                    value={props.difficultyValue}
                    onChange={props.setDifficulty}
                    name={'btn'}
                />
                <span className="checkmark" >{props.difficultyName}</span>
            </label>
    )


}

export default DifficultyButton