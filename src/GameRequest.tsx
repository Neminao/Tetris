import React from 'react';

class GameRequest extends React.Component<{ name: string, accept: any }, {}> {
    accept = () => {
        this.props.accept();
    }
    render() {
        return (
            <div className={'request'}>{this.props.name} wants to play a game.
            <br></br>
                <button onClick={this.accept}>Accept</button>
                
            </div>
        )
    }
}

export default GameRequest