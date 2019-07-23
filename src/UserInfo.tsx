import React from 'react'

function UserInfo(props: any) {
    let show;
    switch (props.gameMode) {
        case 1: show = '- Game mode: Singleplayer'; break;
        case 2: show = '- Game mode: Multiplayer'; break;
        case 3: show = '- Game mode: Spectating'; break;
        default: show = null; break;
    }
    
    return (
        <div className={"userInfo"}>
            <div className='usernameDisplay'>
                User: {props.user} {show}
            </div>
            <div className='buttonDisplay'>
                <button className="resetBtn" onClick={props.setDisplay} value={0}>Menu</button>
                <button onClick={props.logout}>Logout</button>
            </div>
        </div>
    )
}

export default UserInfo

//{props.reciever.length > 0 && props.isPlayerReady ? 'Users in game: ' + props.displayRecievers : null}