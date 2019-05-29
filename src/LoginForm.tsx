import React from 'react'
import { VERIFY_USER } from './Events'
import CM from './ClientManager'

class LoginForm extends React.Component<{ setUser: any; }, { nickname: string; error: string; }> {

    textInput: HTMLInputElement | null | undefined;
    constructor(props: any) {
        super(props);
        this.state = {
            nickname: "",
            error: ""
        }
    }
    setError = (error: string) => {
        this.setState({ error: error })
    }
    setUser = ({ user, isUser }: any) => {
        if (isUser) {
            this.setError('Username taken');
        }
        else {
            this.props.setUser(user);
            this.setError('')
        }
    }
    handleChange = (event: any) => {
        const { value } = event.target
        this.setState({
            nickname: value
        })
    }
    handleSubmit = (event: any) => {
        event.preventDefault();
        const { nickname } = this.state;
        CM.emitVerifyUser(nickname, this.setUser);
    }

    render() {
        const { nickname, error } = this.state
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label htmlFor='nickname'>Enter your nickname:</label><br></br>
                    <input
                        ref={(input) => { this.textInput = input }}
                        type='text'
                        id='nickname'
                        value={nickname}
                        onChange={this.handleChange}
                        placeholder={'username'}
                    />
                    <div className="error">{error ? error : null}</div>
                </form>
            </div>
        )
    }
}

export default LoginForm