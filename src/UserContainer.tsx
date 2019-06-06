import React from 'react';
import { values } from 'lodash';
import GameRequest from './GameRequest';
import CM from './ClientManager'


class UserContainer extends React.Component<{
    user: any, logout: any, setGeneratedShapes: any,
    setReciever: any, reciever: string[], startGame: any, isPlayerReady: boolean,
    changePlayerStatus: any, running: boolean, reset: any,
    setOpponentNumber: any
},
    {
        users: any[],
        reqSent: boolean,
        sender: string,
        showReq: boolean,
        to: string[],
        showSide: boolean,
        selectedPlayers: string[]
    }>{
    constructor(props: any) {
        super(props);
        this.state = {
            users: [],
            reqSent: false,
            sender: '',
            showReq: true,
            to: [],
            showSide: true,
            selectedPlayers: []
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
    accept = () => {
        const { setReciever, user } = this.props;
        const { to } = this.state;
        this.setState({ to, showReq: false })
        setReciever(to);
        CM.emitUserReady(to, user)
    }

    sendInvite = (event: any) => {      
        let players = this.state.selectedPlayers;
        players.push(event.target.value);
        this.setState({selectedPlayers: players});
        
        event.target.style.backgroundColor = "#70dbdb";
    }
    inviteAll = () => {
        const { user, setReciever } = this.props;
        let {selectedPlayers} = this.state;
        console.log(selectedPlayers)
        this.setState({ to: selectedPlayers })
        setReciever(selectedPlayers);
        CM.emitGameRequest(user, selectedPlayers);
    }
    displayUsers = (allUsers: any) => {
        const { user, reciever, setReciever } = this.props;
      /*  if(!(reciever in allUsers)){
            setReciever("");
        }*/
        let users: any = [];
        users = values(allUsers).map((u) => {
            if (u.name != user && !u.inGame) {
                return <button value={u.name} className={'sideBtn'} onClick={this.sendInvite}>{u.name}</button>
            }
        })
        this.setState({ users: users })
    }
    startGame = (event: any) => {
        const { user, reciever } = this.props;
        this.setState({ showReq: false });
        setTimeout(() => CM.emitGameStart(reciever, user), 1500);
    }
    reset = () => {
        this.props.reset();
        this.setState({
            reqSent: false,
            showReq: true,
            to: [],
            showSide: true
        });
        CM.emitReset(this.props.reciever, this.props.user);
        console.log(this.state);
    }

    setNumberOfOpponents = (event: any) => {
        this.props.setOpponentNumber(event.target.value);
    }
    render = () => {
        const { user, logout, isPlayerReady, running, reset } = this.props;
        const { sender, reqSent, showReq, showSide } = this.state;
        return (
            <div>
                {(showSide) ? <div className={'sideTab'}>Select player:{this.state.users}</div> :null}
                <div className={"userInfo"}>User: {user} <button onClick={logout}>Logout</button><button className={'resetBtn'} onClick={this.reset}>Reset</button></div>
                
                <div>
                  <button value={4} onClick={this.setNumberOfOpponents}>4 players</button> <br></br> 
                  <button onClick={this.inviteAll}>Invite All</button>
                </div>
                {(reqSent && showReq && false) ? <GameRequest name={sender} accept={this.accept} /> : null}
                {(isPlayerReady) ? <div className='buttonsBlock'>
                    <button className={'startBtn'} onClick={this.startGame}>Start</button><br></br>
                </div> : null}

            </div>
        )
    }
}

export default UserContainer

