import React from 'react';

class GameRequest extends React.Component<{ name: string, accept: any }, {}> {
    accept = (event: any) => {
        if(event.target.value == 1)
        this.props.accept(true);
        else if(event.target.value == 0)
        this.props.accept(false);
    }
    render() {
        return (
            <div className={'request'}>{this.props.name} wants to play a game.
            <br></br>
                <button onClick={this.accept} value={1}>Accept</button>
                <button onClick={this.accept} value={0}>Decline</button>
            </div>
        )
    }
}

export default GameRequest