import React from 'react';
import UniversalShapeContext from './UniversalShapeContext';
import Highscore from './Highscore';
import CM from './ClientManager';
import AutoComplete from './AutoComplete';
import UserInfo from './UserInfo';

class Menu extends React.Component<{ user: any }, { display: number; difficulty: number; highscore: any[], highscoreEasy: any[] }> {
    constructor(props: any) {
        super(props);
        this.state = {
            display: 0,
            difficulty: 7,
            highscore: [],
            highscoreEasy: []
        }
    }
    componentDidMount = () => {

        // change MySQL connetion first
       // CM.initMenu(this.setHighscore)
    }
    setDisplay = (event: any) => {
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

    render() {
        const { display, difficulty, highscore, highscoreEasy } = this.state;
        const { user } = this.props
        let show = <div></div>;
        switch (display) {
            case 0:
                show =
                    <div>
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
                        
                    </div>; break;
            case 1:
                show = <UniversalShapeContext setDisplay={this.setDisplay} difficulty={difficulty} user={user} mode={display} />;
                console.log(1)
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
            <div>
                <UserInfo user={user.name}/>
                {show}
                {display == 0 || display == 4 || display == 5 ? <div className='transparent'> <AutoComplete
                            rows={20}
                            columns={Math.floor(window.innerWidth / 2 / 40)}
                            blockSize={40}
                        />
                        </div> : null}
            </div>
        )
    }
}

export default Menu;