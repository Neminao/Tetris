import React from 'react'

function UserInfo(props: any) {
    return (
    <div className={"userInfo"}>
                User: {props.user}                
                <button onClick={props.logout}>Logout</button>
                <button className={'resetBtn'} onClick={props.reset}>Reset</button>              
                </div>
    )
}

export default UserInfo

//{props.reciever.length > 0 && props.isPlayerReady ? 'Users in game: ' + props.displayRecievers : null}