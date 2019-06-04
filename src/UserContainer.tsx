import React from 'react';
import { values } from 'lodash';
import GameRequest from './GameRequest';
import CM from './ClientManager'


class UserContainer extends React.Component<{
    user: any, logout: any, setGeneratedShapes: any,
    setReciever: any, reciever: string, startGame: any, isPlayerReady: boolean,
    changePlayerStatus: any, running: boolean, reset: any
},
    {
        users: any[],
        reqSent: boolean,
        sender: string,
        showReq: boolean,
        to: string,
        showSide: boolean
    }>{
    constructor(props: any) {
        super(props);
        this.state = {
            users: [],
            reqSent: false,
            sender: '',
            showReq: true,
            to: '',
            showSide: true
        }
    }
    componentDidMount() {
        CM.initUserContainer(this.displayUsers, this.setSender, this.setRequest, this.props.startGame, this.showRequest, this.setSide, this.props.setReciever)
    }

    setSender = (sender: string) => {
        this.setState({ sender, reqSent: true })
    }
    setRequest = () => {
        this.setState({ reqSent: true, showReq: false });
    }
    setSide = (status: boolean) => {
        this.setState({showSide: status});
    }
    showRequest = (status: boolean) => {
        this.setState({
            showReq: status,
            reqSent: false
        })
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
        event.target.style.backgroundColor = "#70dbdb";
    }
    displayUsers = (allUsers: any) => {
        const { user, reciever, setReciever } = this.props;
        if(!(reciever in allUsers)){
            setReciever("");
        }
        let users: any = [];
        users = values(allUsers).map((u) => {
            if (u.name != user && !u.inGame) {
                return <button value={u.name} className={'sideBtn'} onClick={this.sendInvite}>{u.name}</button>
            }
        })
        this.setState({ users: users })
    }
    startGame = () => {
        const { user, reciever } = this.props;
        this.setState({ showReq: false });
        setTimeout(() => CM.emitGameStart(reciever, user), 1500);
    }
    reset = () => {
        this.props.reset();
        this.setState({
            reqSent: false,
            showReq: true,
            to: '',
            showSide: true
        });
        CM.emitReset(this.props.reciever, this.props.user);
        console.log(this.state);
    }
    render = () => {
        const { user, logout, isPlayerReady, running, reset } = this.props;
        const { sender, reqSent, showReq, showSide } = this.state;
        return (
            <div>
                {(showSide) ? <div className={'sideTab'}>Select player:{this.state.users}</div> :null}
                <div className={"userInfo"}>User: {user} <button onClick={logout}>Logout</button><button className={'resetBtn'} onClick={this.reset}>Reset</button></div>
                
                <div>
                    
                </div>
                {(reqSent && showReq) ? <GameRequest name={sender} accept={this.accept} /> : null}
                {(isPlayerReady) ? <div className='buttonsBlock'>
                    <button className={'startBtn'} onClick={this.startGame}>Start</button><br></br>
                </div> : null}

            </div>
        )
    }
}

export default UserContainer

