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
        const { recievers, initializeGame, showInitBtn, invitedPlayers, isPlayer, gameMaster } = this.props;
        
      

        return (
            <div className={'gameSetup'}>
                <p>Game Setup</p>

                {invitedPlayers.length > 0 ?
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
                                        {invitedPlayers[1] ? invitedPlayers[1] : '  '}
                                    </td>

                                </tr>

                            </tbody>
                        </table>
                        <table className='tableRight'>
                            <tbody>
                                <tr>
                                    <td className='tdWide' id='rightAlign'>
                                        {invitedPlayers[0] ? invitedPlayers[0] : '  '}
                                    </td>
                                    <td className='tdNarrow'>
                                        Player 2
                                </td>

                                </tr>
                                <tr>

                                    <td className='tdWide' id='rightAlign'>
                                        {invitedPlayers[2] ? invitedPlayers[2] : '  '}
                                    </td>
                                    <td className='tdNarrow'>
                                        Player 4
                                </td>
                                </tr>

                            </tbody>
                        </table>
                    </div>
                    : <p>Select players from left sidebar and then invite them or wait for an invite to enter a multiplayer game</p>}

                
                {(recievers.length > 0 && showInitBtn) ? <button className="roundBtn" onClick={initializeGame} >Initialize Game</button> : null}
                {isPlayer ? <div className="roundDiv"><div className='innerRound'>Waiting for other players...</div></div> : null}
            </div>
        )
    }
}

export default GameSetupScreen