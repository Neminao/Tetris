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

    render() {
        const { selectedPlayers, recievers, user, initializeGame, denied, showInitBtn, invitedPlayers, isPlayer, gameMaster } = this.props;
        let selected = '', recs = '', d = '', invited = '';
       /* selected = this.createStringFromArray(selectedPlayers, selected);
        recs = this.createStringFromArray(recievers, recs);
        d = this.createStringFromArray(denied, d);*/
        //invited = this.createStringFromArray(invitedPlayers, invited);

        return (
            <div className={'gameSetup'}>
                <p>Game Setup</p>

                {recievers.length > 0 ?
                    <div>
                        <table className='tableLeft'>
                            <tbody>
                                <tr>
                                    <td className='tdNarrow'>
                                        Player 1
                            </td>
                                    <td className='tdWide' id='leftAlign'>
                                        {gameMaster ? gameMaster : ' '}
                                    </td>

                                </tr>
                                <tr>
                                    <td className='tdNarrow'>
                                        Player 3
                            </td>
                                    <td className='tdWide' id='leftAlign'>
                                        {recievers[1] ? recievers[1] : '  '}
                                    </td>

                                </tr>

                            </tbody>
                        </table>
                        <table className='tableRight'>
                            <tbody>
                                <tr>
                                    <td className='tdWide' id='rightAlign'>
                                        {recievers[0] ? recievers[0] : '  '}
                                    </td>
                                    <td className='tdNarrow'>
                                        Player 2
                                </td>

                                </tr>
                                <tr>

                                    <td className='tdWide' id='rightAlign'>
                                        {recievers[2] ? recievers[2] : '  '}
                                    </td>
                                    <td className='tdNarrow'>
                                        Player 4
                                </td>
                                </tr>

                            </tbody>
                        </table>
                    </div>
                    : <p>Select players from left sidebar and then invite them or wait for an invite to enter a multiplayer game</p>}

                {invitedPlayers.length > 0 ? <p>Invited players: {invited}</p> : null}
                {denied.length > 0 ? <p>Players who declined: {d}</p> : null}
                {(recievers.length > 0 && showInitBtn) ? <button className="roundBtn" onClick={initializeGame} >Initialize Game with current players</button> : null}
                {isPlayer ? <p>Waiting for other players to join...</p> : null}
            </div>
        )
    }
}

export default GameSetupScreen