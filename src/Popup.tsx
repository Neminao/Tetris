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
                {user}{accepted ? ' accepted your request' : ' denied your request'}
            </div>
        )
    }
}

export default Popup;