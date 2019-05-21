import React from 'react'
import { USER_CONNECTED } from './Events'
import { values, difference, differenceBy } from 'lodash'


class ChatContainer extends React.Component<{user: any, logout: any, socket: any, onChange: any}, {users: any[]}>{
    constructor(props: any){
        super(props);
        this.state = {
            users: []
        }
    }
    componentDidMount() {
        const {socket} = this.props;
        this.initSocket(socket);
    }
    initSocket(socket: any) {
        let users: any = []
       socket.on(USER_CONNECTED, (allUsers: any) =>{
        users = values(allUsers).map((user) => {
            return <div>{user.name}</div>
        })
        this.setState({users: users}) 
       })
       
    }
    render=()=>{
        const { user, logout, onChange} = this.props;
        return (
            <div>User: 
            {user.name}
            <div></div>
                To: <input onChange={onChange}></input>
                <button onClick={logout}>Logout</button>
            <div>
                {this.state.users}
            </div>
            
            
            </div>
        )
    }
}

export default ChatContainer