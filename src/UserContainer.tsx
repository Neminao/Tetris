import React from 'react';
import { USER_CONNECTED, USER_DISCONNECTED, GAME_REQUEST, GAME_START, USER_READY, REQUEST_DENIED } from './Events';
import { values } from 'lodash';
import GameRequest from './GameRequest';


class UserContainer extends React.Component<{
    user: any, logout: any, setGeneratedShapes: any,
    socket: any, setReciever: any, reciever: string, startGame: any, isPlayerReady: boolean,
    changePlayerStatus: any
},
    {
        users: any[],
        reqSent: boolean,
        sender: string,
        showReq: boolean
    }>{
    constructor(props: any) {
        super(props);
        this.state = {
            users: [],
            reqSent: false,
            sender: '',
            showReq: true
        }
    }
    componentDidMount() {
        const { socket } = this.props;
        this.initSocket(socket);
    }
    initSocket(socket: any) {
        socket.on(USER_CONNECTED, (allUsers: any) => {
            this.displayUsers(allUsers);
        })
        socket.on(USER_DISCONNECTED, (allUsers: any) => {
            this.displayUsers(allUsers);
        })
        socket.on(GAME_REQUEST, ({ sender }: any) => {
            this.setState({ sender, reqSent: true });
            // this.props.setReciever(sender)
        })
        socket.on(GAME_START, ({ start }: any) => {
            //   this.props.setReciever(this.state.sender)
            if (start) {
                this.props.startGame();
                console.log("start: " + start)
            }
        })
    }
    accept = (to: string) => {
        const { socket, setReciever } = this.props;
        this.setState({ sender: to, showReq: false })
        setReciever(to);
        socket.emit(USER_READY, { to });

    }
    decline = (to: string) => {
        const { socket } = this.props;
        socket.emit(REQUEST_DENIED, to);
    }
    sendInvite = (event: any) => {
        const { socket, user, setReciever } = this.props;
        this.setState({ sender: event.target.value })
        setReciever(event.target.value);
        socket.emit(GAME_REQUEST, { sender: user, reciever: event.target.value });
    }
    displayUsers = (allUsers: any) => {
        const { user } = this.props;
        let users: any = [];
        users = values(allUsers).map((u) => {
            if (u.name != user && !u.inGame) {
                return <button value={u.name} onClick={this.sendInvite}>{u.name}</button>
            }
        })
        this.setState({ users: users })
    }
    startGame = () => {
        const { socket } = this.props;
        const to = this.state.sender;
        console.log("to:" + to)
        socket.emit(GAME_START, to);
    }
    render = () => {
        const { user, logout, isPlayerReady } = this.props;
        const { sender, reqSent, showReq } = this.state;
        return (
            <div>User:
            {user}
                <button onClick={logout}>Logout</button>
                <div>
                    {this.state.users}
                </div>
                {(reqSent && showReq) ? <GameRequest name={sender} accept={this.accept} /> : null}
                {(isPlayerReady) ? <div className='buttonsBlock'>
                    <button onClick={this.startGame}>Start</button><br></br>
                </div> : null}

            </div>
        )
    }
}

export default UserContainer