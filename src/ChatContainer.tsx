import React from 'react'
import GAME_UPDATE from './Events'


class ChatContainer extends React.Component<{user: any, logout: any, socket: any, onChange: any}, {}>{
    componentWillUpdate() {
        const {socket} = this.props;
        this.initSocket(socket);
    }
    initSocket(socket: any) {
       socket.emit(GAME_UPDATE)
        
    }
    render=()=>{
        const { user, logout, onChange} = this.props;
        return (
            <div>User: 
            {user.name}
            <div></div>
                To: <input onChange={onChange}></input>
            </div>
        )
    }
}

export default ChatContainer