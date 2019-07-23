import React from 'react';

class Popup extends React.Component<{user: string, accepted: boolean, resetPopup: any}, {}> {
    close = () => {
        this.props.resetPopup();
    }
    render() {
        const {user, accepted} = this.props;
        return (
            <div className={'request'} >
                
                <p>
                {user}{accepted ? ' accepted your request' : ' denied your request'}
                </p>
                <div>
                <button onClick={this.close}>Close</button>
                </div>
            </div>
        )
    }
}

export default Popup;