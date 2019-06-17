import React from 'react'

class GameSetupScreen extends React.Component<
    {
        selectedPlayers: string[],
        recievers: string[], user: string,
        initializeGame: any,
        denied: string[],
        showInitBtn: boolean,
        invitedPlayers: string[],
        isPlayer: boolean,
        gameMaster: string,
        setDifficulty: any,
        showDifficultySelection: boolean
    },
    {}> {

    createStringFromArray = (array: string[], str: string) => {
        array.forEach(name => {
            if (str) {
                str += ', ' + name;
            }
            else str += name;
        })
        return str;
    }

    setDifficulty = (event: any) => {
        this.props.setDifficulty(event.target.value);
    }
    render() {
        const { selectedPlayers, recievers, user, initializeGame, denied, showInitBtn, invitedPlayers, isPlayer, gameMaster, showDifficultySelection } = this.props;
        let selected = '', recs = '', d = '', invited = '';
        selected = this.createStringFromArray(selectedPlayers, selected);
        recs = this.createStringFromArray(recievers, recs);
        d = this.createStringFromArray(denied, d);
        invited = this.createStringFromArray(invitedPlayers, invited);

        return (
            <div className={'gameSetup'}>
                <p>Current user: {user}</p>
                {gameMaster ? <p>Creating game: {gameMaster}</p> : null}
                {selected.length > 0 || invited.length > 0 ?
                    <table>
                        <tbody>
                            <tr>
                                <td>
                                    Player 1
                            </td>
                                <td>
                                    Player 2
                            </td>
                                <td>
                                    Player 3
                            </td>
                            </tr>
                            <tr>
                                <td>
                                    {recievers[0] ? recievers[0] : ' '}
                                </td>
                                <td>
                                {recievers[1] ? recievers[1] : <br></br>}
                                </td>
                                <td>
                                {recievers[2] ? recievers[2] : ' '}
                                </td>
                            </tr>

                        </tbody>
                    </table> : null}
                {selectedPlayers.length > 0 ? <p>Selected players: {selected}</p> : null}
                {invitedPlayers.length > 0 ? <p>Invited players: {invited}</p> : null}
                {denied.length > 0 ? <p>Players who declined: {d}</p> : null}
                {(recievers.length > 0 && showInitBtn) ? <button onClick={initializeGame} >Initialize Game with current players</button> : null}
                {isPlayer ? <p>Waiting for other players to join...</p> : null}
                {showDifficultySelection ? <div><button value='10' onClick={this.setDifficulty}>Easy</button>
                <button value='7' onClick={this.setDifficulty}>Normal</button></div> : null }
            </div>
        )
    }
}

export default GameSetupScreen