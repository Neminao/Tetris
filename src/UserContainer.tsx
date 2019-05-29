import React from 'react';
import { values } from 'lodash';
import GameRequest from './GameRequest';
import CM from './ClientManager'


class UserContainer extends React.Component<{
    user: any, logout: any, setGeneratedShapes: any,
    setReciever: any, reciever: string, startGame: any, isPlayerReady: boolean,
    changePlayerStatus: any
},
    {
        users: any[],
        reqSent: boolean,
        sender: string,
        showReq: boolean,
        to: string
    }>{
    constructor(props: any) {
        super(props);
        this.state = {
            users: [],
            reqSent: false,
            sender: '',
            showReq: true,
            to: ''
        }
    }
    componentDidMount() {
        CM.initUserContainer(this.displayUsers, this.setSender, this.setRequest, this.props.startGame)
    }

    setSender = (sender: string) => {
        this.setState({ sender, reqSent: true })
    }
    setRequest = () => {
        this.setState({ reqSent: true, showReq: false });
    }
    accept = (to: string) => {
        const { setReciever, user } = this.props;
        this.setState({ sender: to, to, showReq: false })
        setReciever(to);
        CM.emitUserReady(to, user)
    }

    sendInvite = (event: any) => {
        const { user, setReciever } = this.props;
        this.setState({ to: event.target.value })
        setReciever(event.target.value);
        CM.emitGameRequest(user, event.target.value);
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
        const { user } = this.props;
        const to = this.state.to;
        console.log("to:" + to)
        this.setState({ showReq: false });
        CM.emitGameStart(to, user);
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

