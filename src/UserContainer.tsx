import React from 'react';
import { values } from 'lodash';
import GameRequest from './GameRequest';
import CM from './ClientManager';
import GameSetupScreen from './GameSetupScreen';


class UserContainer extends React.Component<{
    user: any, logout: any, setGeneratedShapes: any,
    setRecievers: any, reciever: string[], startGame: any, isPlayerReady: boolean,
    changeSpectatingStatus: any, running: boolean, reset: any,
    addSpectator: any, initGame: any, denied: string[],
    isSpectator: boolean
},
    {
        users: any[],
        reqSent: boolean,
        sender: string,
        showReq: boolean,
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
            this.setSender, this.finalizeStart,
            this.showRequest, this.setSide,
            this.props.setRecievers, this.props.addSpectator,
            this.updateAvailableGames,
            this.setInitBtn, this.updateGameSetupScreen, this.emitGameSetup,
            this.reset, this.removeInvitedPlayer
        )
        CM.emitListUpdate();
    }

    componentWillUpdate() {
        const { reciever, user, isPlayerReady } = this.props;
        const { gameMaster } = this.state;
        if (user == gameMaster && !isPlayerReady) {
            CM.emitGameSetup(user, reciever);
        }
    }
    componentWillUnmount(){
        CM.emitReset([this.state.gameMaster], this.props.user);
    }

    updateGameSetupScreen = (obj: any) => {
        
        this.setState({
            invitedPlayers: obj.recievers,
            gameMaster: obj.master
        })

    }

    finalizeStart = () => {
        this.props.startGame();
        this.setState({ showStartBtn: false })
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
        const { user, isSpectator, reciever, changeSpectatingStatus, setRecievers } = this.props;
        const { sender } = this.state;
        this.setState({ showReq: false });
        if (tf) {

            if (isSpectator) {
                CM.emitReset(reciever, user);
                changeSpectatingStatus(false);
                setRecievers([]);
                this.setInitBtn(true);
            }

            CM.emitUserReady(user, sender);
            this.setState({
                isGameMaster: false,
                isPlayer: true
            })
        }
        else {
            CM.emitRequestDenied(user, sender);
            if(!isSpectator)this.reset();
        }
    }
    emitGameSetup = () => {
        const { user, reciever } = this.props;
        this.setState({ invitedPlayers: reciever })
        CM.emitGameSetup(user, reciever);
    }
    removeInvitedPlayer = (user: string) => {
        let {invitedPlayers}= this.state;
        const index = invitedPlayers.indexOf(user);
        if(index != -1){
            invitedPlayers.splice(index, 1);
            this.setState({
                invitedPlayers
            })
        }
    }

    sendInvite = (event: any) => {
        const { isPlayer } = this.state;
        const { isSpectator, reciever, user, changeSpectatingStatus, setRecievers } = this.props;
        let players = this.state.selectedPlayers;
        let invited = this.state.invitedPlayers;
        let index1 = players.indexOf(event.target.value);
        let index2 = invited.indexOf(event.target.value);
        if (!isPlayer) {
            if (isSpectator) {
                CM.emitReset(reciever, user);
                changeSpectatingStatus(false);
                setRecievers([]);
                this.setInitBtn(true);
            }
            if (index1 == -1 && index2 == -1) {
                players.push(event.target.value);
                event.target.innerHTML = "Invited";
                event.target.disabled = true;
                event.target.style.backgroundColor = "green";
                this.setState({ isGameMaster: true, gameMaster: user });
                CM.emitGameRequest(user, event.target.value);
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
            if (u.name != user && !u.inGame && u.gameMode == 1) {
                const className = (u.name.length >= 12) ? 'sideBtnSmall' : 'sideBtn';
                return <div key={u.name} className={className}>{u.name}<button value={u.name} onClick={this.sendInvite}>Invite</button></div>;
            }
        })
        /*let i =0;
        while(i<20){
            i++;
            users.push(<div className='sideBtn'>Js<button>Invite</button></div>)
        }*/
        this.setState({ users: users })
    }
    updateAvailableGames = (games: any) => {
        let users = values(games).map((u) => {
            const className = (u.sender.length >= 12) ? 'sideBtnSmall' : 'sideBtn';
            return <div className={className}>{u.sender}'s game<button value={u.sender} onClick={this.spectate}>Watch</button></div>;
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
        if (this.state.gameMaster)
            recievers.push(this.state.gameMaster);
        CM.emitReset(recievers, this.props.user);

        this.props.reset();
        this.setState({
            users: [],
            reqSent: false,
            sender: '',
            showReq: true,
            showSide: true,
            selectedPlayers: [],
            showInitBtn: true,
            showStartBtn: true,
            invitedPlayers: [],
            accepted: [],
            isGameMaster: false,
            isPlayer: false,
            gameMaster: ''

        });

    }

    spectate = (event: any) => {
        //this.reset();
        CM.emitSpectate(this.props.user, event.target.value);
        this.props.changeSpectatingStatus(true);
        this.setInitBtn(false);
    }

    render = () => {
        const { user, isPlayerReady, running, reciever, initGame, denied, isSpectator } = this.props;
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
            <div className='setupWrapper'>
                {(showSide && !isSpectator) ?
                    <div className={'sideTab'}>
                        <p>Available players:</p>{this.state.users}
                    </div>
                    : null}

                {(showSide && isSpectator) ?
                    <div className={'sideTab'}>
                        <p>Games:</p>{displayGames}
                    </div>
                    : null}

                {showInitBtn ?
                    <div>

                        <GameSetupScreen
                            user={user}
                            initializeGame={initGame}
                            selectedPlayers={selectedPlayers}
                            recievers={reciever} denied={denied}
                            showInitBtn={showInitBtn && isGameMaster && !isPlayer}
                            invitedPlayers={invitedPlayers}
                            isPlayer={isPlayer}
                            gameMaster={gameMaster}
                        />
                    </div> : null}

                {(reqSent && showReq) ? <GameRequest name={sender} accept={this.accept} /> : null}
                {(isPlayerReady && showStartBtn && isGameMaster) ? <div className='buttonsBlock'>

                    <button className={'startBtn'} onClick={this.startGame}>Start</button><br></br>
                </div> : null}

            </div>
        )
    }
}

export default UserContainer

