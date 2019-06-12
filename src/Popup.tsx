import React from 'react';

class Popup extends React.Component<{user: string, accepted: boolean, resetPopup: any}, {}> {
    close = () => {
        this.props.resetPopup();
    }
    render() {
        const {user, accepted} = this.props;
        return (
            <div className={'popupOpen'} >
                <button onClick={this.close}>Close</button>
                <p>
                {user}{accepted ? ' accepted your request' : ' denied your request'}
                </p>
            </div>
        )
    }
}

export default Popup;