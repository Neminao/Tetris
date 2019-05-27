import React from 'react'
import { USER_CONNECTED, USER_DISCONNECTED, USER_READY } from './Events'
import { values, difference, differenceBy } from 'lodash'


class UserContainer extends React.Component<{user: any, setReady: any, logout: any, socket: any, onChange: any, reciever: string, startGame: any}, {users: any[], userReady: boolean, recieverReady: boolean}>{
    constructor(props: any){
        super(props);
        this.state = {
            users: [],
            userReady: false,
            recieverReady: false
        }
    }
    componentDidMount() {
        const {socket} = this.props;
        this.initSocket(socket);
    }
    initSocket(socket: any) {
       socket.on(USER_CONNECTED, (allUsers: any) =>{
        this.displayUsers(allUsers);
       })
       socket.on(USER_DISCONNECTED, (allUsers: any) =>{
        this.displayUsers(allUsers);
       })
       
    }
    displayUsers= (allUsers: any) => {
        const {user, reciever} = this.props;
        let users: any = []
        users = values(allUsers).map((u) => {
            let color = (u.isReady) ? 'green' : 'red';
            if(u.name == user && u.isReady) { 
                this.setState({userReady: true})
                console.log(user)};
                if(u.name == reciever && u.isReady) {
                    this.setState({recieverReady: true});
                    console.log(reciever);
                }
            if(u.name != user && !u.inGame) {
                
                
            return <button style={{backgroundColor: color}}value={u.name} onClick={this.props.onChange}>{u.name}</button>
            }
        })
        this.setState({users: users}) 
    }
    render=()=>{
        const { user, logout, onChange, setReady, reciever, startGame} = this.props;
        const {userReady, recieverReady} = this.state;
        return (
            <div>User: 
            {user}
            <div>
            {reciever ? <button onClick={setReady}>Ready</button> : null}
            </div>
                To: <input onChange={onChange}></input>
                <button onClick={logout}>Logout</button>
            <div>
                {this.state.users}
            </div>
            {(userReady && recieverReady) ? <div className='buttonsBlock'>
                        <button onClick={startGame}>Start</button><br></br>
                    </div> : null }
            
            </div>
        )
    }
}

export default UserContainer