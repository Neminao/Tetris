import React from 'react';

class GameRequest extends React.Component<{ name: string, accept: any }, {}> {
    accept = () => {
        this.props.accept(this.props.name);
    }
    render() {
        return (
            <div>{this.props.name} wants to play a game.
            <br></br>
                <button onClick={this.accept}>Accept</button>
                <button>Decline</button>
            </div>
        )
    }
}

export default GameRequest