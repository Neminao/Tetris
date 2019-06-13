import React from 'react';
import { values } from 'lodash';
import GameRequest from './GameRequest';
import CM from './ClientManager';
import GameSetupScreen from './GameSetupScreen';


class UserContainer extends React.Component<{
    user: any, logout: any, setGeneratedShapes: any,
    setReciever: any, reciever: string[], startGame: any, isPlayerReady: boolean,
    changePlayerStatus: any, running: boolean, reset: any,
    addSpectator: any, initGame: any, denied: string[], diffculty: number, setDifficulty: any
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
        showStartBtn: boolean,
        invitedPlayers: string[],
        accepted: string[],
        isGameMaster: boolean,
        isPlayer: boolean,
        gameMaster: string,

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
            showStartBtn: true,
            invitedPlayers: [],
            accepted: [],
            isGameMaster: false,
            isPlayer: false,
            gameMaster: '',
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
            this.setInitBtn, this.updateGameSetupScreen, this.emitGameSetup
        )
    }

    updateGameSetupScreen = (obj: any) => {
        this.setState({
            invitedPlayers: obj.invited,
            gameMaster: obj.master
        })
        this.props.setReciever(obj.recievers);
    }

    finalizeStart = () => {
        this.props.startGame();
        this.setState({ showStartBtn: false })
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
            this.setState({
                isGameMaster: false,
                isPlayer: true
            })
        }
        else {
            CM.emitRequestDenied(user, sender);
        }
    }
    emitGameSetup = () => {
        const { user, reciever } = this.props;
        const { invitedPlayers } = this.state
        CM.emitGameSetup(user, reciever, invitedPlayers);
    }

    sendInvite = (event: any) => {
        const { isPlayer } = this.state;
        let players = this.state.selectedPlayers;
        let invited = this.state.invitedPlayers;
        let index1 = players.indexOf(event.target.value);
        let index2 = invited.indexOf(event.target.value);
        if (!isPlayer) {
            if (index1 == -1 && index2 == -1) {
                players.push(event.target.value);
                this.setState({ selectedPlayers: players, isGameMaster: true });
            }
        }
    }

    inviteAll = () => {
        const { user, reciever } = this.props;
        const { isPlayer } = this.state;
        let selected = this.state.selectedPlayers;
        let invited = this.state.invitedPlayers;
        if (!isPlayer) {
            invited = invited.concat(selected);
            this.setState({ invitedPlayers: invited });
            if (reciever.length < 3) {

                this.setState({ to: selected })
                CM.emitGameRequest(user, selected);
                this.setState({ selectedPlayers: [], gameMaster: user });
            }
        }

    }

    setInitBtn = (showInitBtn: boolean) => {
        this.setState({ showInitBtn });
    }

    displayUsers = (allUsers: any) => {
        const { user } = this.props;

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
            return <button value={u.sender} className={'sideBtn'} onClick={this.spectate}>{u.sender}'s game</button>;
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
        let recievers = this.props.reciever;
        if(this.state.gameMaster)
        recievers.push(this.state.gameMaster);
        CM.emitReset(recievers, this.props.user);

        this.props.reset();
        this.setState({
                users: [],
                reqSent: false,
                sender: '',
                showReq: true,
                to: [],
                showSide: true,
                selectedPlayers: [],
                games: [],
                showInitBtn: true,
                showStartBtn: true,
                invitedPlayers: [],
                accepted: [],
                isGameMaster: false,
                isPlayer: false,
                gameMaster: ''
            
        });
        
    }

    logout = (e: any) => {
        this.reset();
        this.props.logout(e);
    }

    spectate = (event: any) => {
        CM.emitSpectate(this.props.user, event.target.value);
        this.props.changePlayerStatus();
        this.setInitBtn(false);
    }

    render = () => {
        const { user, logout, isPlayerReady, running, reciever, initGame, denied, diffculty } = this.props;
        const { sender, reqSent, showReq, showSide, games, showInitBtn, showStartBtn, invitedPlayers, selectedPlayers, isGameMaster, isPlayer, gameMaster } = this.state;
        let displayRecievers = "";
        let displayGames = null;
        if (games && !running) {
            displayGames = games;
        }
        reciever.forEach(name => {
            if (displayRecievers == "") {
                displayRecievers += name;
            }
            else displayRecievers += ", " + name;
        })
        return (
            <div>
                {(showSide) ?
                    <div className={'sideTab'}>
                        Select players:{this.state.users}
                        <button className={'inviteBtn'} onClick={this.inviteAll}>Invite</button>Spectate a game:{displayGames}
                    </div>
                    : null}

                <div className={"userInfo"}>User: {user} {reciever.length > 0 && isPlayerReady ? 'Users in game: ' + displayRecievers : null}<button onClick={this.logout}>Logout</button><button className={'resetBtn'} onClick={this.reset}>Reset</button></div>


                {showInitBtn ?
                    <GameSetupScreen
                        user={user}
                        initializeGame={initGame}
                        selectedPlayers={selectedPlayers}
                        recievers={reciever} denied={denied}
                        showInitBtn={showInitBtn && isGameMaster && !isPlayer && diffculty != -1}
                        invitedPlayers={invitedPlayers}
                        isPlayer={isPlayer}
                        gameMaster = {gameMaster}
                        setDifficulty={this.props.setDifficulty}
                        showDifficultySelection={gameMaster==user && diffculty == -1}
                    /> : null}

                {(reqSent && showReq) ? <GameRequest name={sender} accept={this.accept} /> : null}
                {(isPlayerReady && showStartBtn && isGameMaster) ? <div className='buttonsBlock'>
                    <button className={'startBtn'} onClick={this.startGame}>Start</button><br></br>
                </div> : null}

            </div>
        )
    }
}

export default UserContainer

