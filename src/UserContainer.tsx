import React from 'react';
import { values } from 'lodash';
import GameRequest from './GameRequest';
import CM from './ClientManager'


class UserContainer extends React.Component<{
    user: any, logout: any, setGeneratedShapes: any,
    setReciever: any, reciever: string[], startGame: any, isPlayerReady: boolean,
    changePlayerStatus: any, running: boolean, reset: any,
    setOpponentNumber: any, addSpectator: any
},
    {
        users: any[],
        reqSent: boolean,
        sender: string,
        showReq: boolean,
        to: string[],
        showSide: boolean,
        selectedPlayers: string[],
        games: any,
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
            selectedPlayers: [],
            games: []
        }
    }
    componentDidMount() {
        CM.initUserContainer(
            this.displayUsers,
            this.setSender,
            this.setRequest, this.props.startGame,
            this.showRequest, this.setSide,
            this.props.setReciever, this.props.addSpectator,
            this.updateAvailableGames, this.removeReciever
            )
    }

    removeReciever = (name: string) => {
        let rec = this.state.selectedPlayers;
        let index = rec.indexOf(name)
        rec.splice(index, 1);
        this.setState({
            selectedPlayers: rec
        })
    }

    setSender = (sender: string) => {
        this.setState({ sender, reqSent: true })
    }
    setRequest = () => {
        this.setState({ reqSent: true, showReq: false });
    }
    setSide = (status: boolean) => {
        this.setState({ showSide: status });
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
        if(players.length<3){
        players.push(event.target.value);
        this.setState({ selectedPlayers: players });
        event.target.style.backgroundColor = "#70dbdb";
        }
    }

    inviteAll = () => {
        const { user, setReciever } = this.props;
        let { selectedPlayers } = this.state;
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
    updateAvailableGames = (games: any) => {
        let users = values(games).map((u) => {
            return <button value={u.sender} className={''} onClick={this.spectate}>{u.sender}'s game</button>;
        })
        this.setState({
            games: users
        })
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

    spectate = (event: any) => {
        CM.emitSpectate(this.props.user, event.target.value);
        this.props.changePlayerStatus();
    }

    setNumberOfOpponents = (event: any) => {
        this.props.setOpponentNumber(event.target.value);
    }
    render = () => {
        const { user, logout, isPlayerReady, running, reset } = this.props;
        const { sender, reqSent, showReq, showSide, games } = this.state;
        return (
            <div>
                {(showSide) ? <div className={'sideTab'}>Select player:{this.state.users}</div> : null}
                
                <div className={"userInfo"}>User: {user} <button onClick={logout}>Logout</button><button className={'resetBtn'} onClick={this.reset}>Reset</button></div>
                {(games) ? <div className={''}>Select Game:{games}</div> : null}
                <div>
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

