import React from 'react';
import UniversalShapeContext from './UniversalShapeContext';
import Highscore from './Highscore';
import CM from './ClientManager';
import AutoComplete from './AutoComplete';
import UserInfo from './UserInfo';

class Menu extends React.Component<{ user: any, logout: any }, { width: number, display: number; difficulty: number; highscore: any[], highscoreEasy: any[] }> {
    constructor(props: any) {
        super(props);
        this.state = {
            display: 0,
            difficulty: 7,
            highscore: [],
            highscoreEasy: [],
            width: window.innerWidth
        }
    }
    componentDidMount = () => {
        this.setState({width: window.innerWidth})
        // change MySQL connetion first
        CM.initMenu(this.setHighscore)
    }
    setDisplay = (event: any) => {
        const value = event.target.value * 1
        if (value == 2 || value == 3) {
            CM.emitMultiplayer(this.props.user.name)
        }
        this.setState({
            display: event.target.value * 1
        })
        
    }

    setHighscore = (highscore: any) => {
        highscore.mode == 'normal' ? this.setState({ highscore: highscore.result }) : this.setState({ highscoreEasy: highscore.result });
        
    }

    setDifficulty = (event: any) => {
        this.setState({
            difficulty: event.target.value * 1,
            display: 0
        })
    }

    logout = () => {
        CM.emitLogout();
        this.props.logout();
    }

    render() {
        const { display, difficulty, highscore, highscoreEasy, width } = this.state;
        const { user } = this.props
        let show = <div></div>;
        switch (display) {
            case 0:
                show =
                    
                        <div className="leftMenu">
                            <p className='title2'>TETRIS</p>

                            <div className="menuButtons">

                                <p>Menu</p>
                                <button onClick={this.setDisplay} value={1}>SINGLEPLAYER</button>
                                <button onClick={this.setDisplay} value={2}>MULTIPLAYER</button>
                                <button onClick={this.setDisplay} value={3}>SPECTATE</button>
                                <button onClick={this.setDisplay} value={4}>SETTINGS</button>
                                <button onClick={this.setDisplay} value={5}>HIGHSCORES</button>
                            </div>
                        </div>

                    ; break;
            case 1:
                show = <UniversalShapeContext setDisplay={this.setDisplay} difficulty={difficulty} user={user} mode={display} />;
                
                    ; break;
            case 2:
                show = <UniversalShapeContext setDisplay={null} difficulty={difficulty} user={user} mode={display} />
                    ; break;
            case 3:
                show = <UniversalShapeContext setDisplay={null} difficulty={difficulty} user={user} mode={display} />
                    ; break;
            case 4:
                show =
                    <div className="leftMenu">
                        <p className='title2'>TETRIS</p>
                        <div className="menuButtons">
                            <p>Select difficulty</p>
                            <button onClick={this.setDifficulty} value={7}>NORMAL</button>
                            <button onClick={this.setDifficulty} value={10}>EASY</button>
                            <button onClick={this.setDisplay} value={0}>Back</button>
                        </div>
                    </div>
                    ; break;
            case 5:
                show = <div className="leftMenu"><div className="highscoreWrapper">

                    {highscore != [] ? <Highscore scores={highscore} title={"Normal"} /> : null}
                    {highscoreEasy != [] ? <Highscore scores={highscoreEasy} title={"Easy"} /> : null}
                    <button onClick={this.setDisplay} value={0}>Back</button>
                </div>
                </div>; break;
        }


        return (
            <div className='mainWrapper'>
                <UserInfo user={user.name} logout={this.logout} setDisplay={this.setDisplay} gameMode={display} />
                <div className='menuWrapper'>
                    {show}
                    {display == 0 || display == 4 || display == 5 ?
                        <AutoComplete
                            rows={20}
                            columns={20}
                            blockSize={Math.round(width / 2 / 22)}
                        /> : null}
                </div>
            </div>
        )
    }
}

export default Menu;