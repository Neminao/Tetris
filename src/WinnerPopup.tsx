import React from 'react';

function WinnerPopup(props: any) {
    return (
        <div className='winnerPopup'>
        <button onClick={props.close}>Close</button>
        Winner is: {props.winner}<br></br>
        Score is: {props.score}</div>
    )
}

export default WinnerPopup