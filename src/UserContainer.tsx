import React from 'react';
import { values } from 'lodash';
import GameRequest from './GameRequest';
import CM from './ClientManager'


class UserContainer extends React.Component<{
    user: any, logout: any, setGeneratedShapes: any,
    setReciever: any, reciever: string[], startGame: any, isPlayerReady: boolean,
    changePlayerStatus: any, running: boolean, reset: any,
    setOpponentNumber: any, addSpectator: any, initGame: any
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
        showInitBtn: boolean,
        showStartBtn: boolean
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
            games: [],
            showInitBtn: true,
            showStartBtn: true
        }
    }
    componentDidMount() {
        CM.initUserContainer(
            this.displayUsers,
            this.setSender,
            this.setRequest, this.finalizeStart,
            this.showRequest, this.setSide,
            this.props.setReciever, this.props.addSpectator,
            this.updateAvailableGames, this.removeReciever,
            this.setInitBtn
        )
    }

    finalizeStart = () => {
        this.props.startGame();
        this.setState({showStartBtn: false})
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
    accept = (tf: boolean) => {
        const { user } = this.props;
        const { sender } = this.state;
        this.setState({ showReq: false })
        if (tf) {
            CM.emitUserReady(user, sender);
        }
        else {
            CM.emitRequestDenied(user, sender);
        }
    }

    sendInvite = (event: any) => {
        let players = this.state.selectedPlayers;

        players.push(event.target.value);
        this.setState({ selectedPlayers: players });
        event.target.style.backgroundColor = "#70dbdb";

    }

    inviteAll = () => {
        const { user, reciever } = this.props;
        let { selectedPlayers } = this.state;
        if (reciever.length < 3) {
            console.log(selectedPlayers)
            this.setState({ to: selectedPlayers })
            CM.emitGameRequest(user, selectedPlayers);
            this.setState({ selectedPlayers: [] });
        }
    }

    setInitBtn = (showInitBtn: boolean) => {
        this.setState({ showInitBtn });
    }

    displayUsers = (allUsers: any) => {
        const { user} = this.props;
        
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
            games: users,
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
            users: [],
            reqSent: false,
            sender: '',
            showReq: true,
            to: [],
            showSide: true,
            selectedPlayers: [],
            showInitBtn: true,
            showStartBtn: true
        });
        CM.emitReset(this.props.reciever, this.props.user);
        console.log(this.state);
    }

    spectate = (event: any) => {
        CM.emitSpectate(this.props.user, event.target.value);
        this.props.changePlayerStatus();
        this.setInitBtn(false);
    }

    setNumberOfOpponents = (event: any) => {
        this.props.setOpponentNumber(event.target.value);
    }

    render = () => {
        const { user, logout, isPlayerReady, running, reciever, initGame } = this.props;
        const { sender, reqSent, showReq, showSide, games, showInitBtn, showStartBtn } = this.state;
        let displayRecievers = "";
        reciever.forEach(name => {
            if (displayRecievers == "") {
                displayRecievers += name;
            }
            else displayRecievers += ", " + name;
        })
        return (
            <div>
                {(showSide) ? <div className={'sideTab'}>Select player:{this.state.users}</div> : null}

                <div className={"userInfo"}>User: {user} Selected players: {displayRecievers}<button onClick={logout}>Logout</button><button className={'resetBtn'} onClick={this.reset}>Reset</button></div>
                {(games && !running) ? <div className={''}>Select Game:{games}</div> : null}
                <div>
                    <button onClick={this.inviteAll}>Invite All</button>
                </div>
                {(reqSent && showReq) ? <GameRequest name={sender} accept={this.accept} /> : null}
                {(reciever.length > 0 && showInitBtn) ? <button className={'startBtn'} onClick={initGame}>InitializeGame</button> : null}
                {(isPlayerReady && showStartBtn) ? <div className='buttonsBlock'>
                    <button className={'startBtn'} onClick={this.startGame}>Start</button><br></br>
                </div> : null}

            </div>
        )
    }
}

export default UserContainer

