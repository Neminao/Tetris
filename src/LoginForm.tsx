import React from 'react'
import CM from './ClientManager'

class LoginForm extends React.Component<{ setUser: any; }, { nickname: string; error: string; password: string;}> {

    textInput: HTMLInputElement | null | undefined;
    constructor(props: any) {
        super(props);
        this.state = {
            nickname: "",
            error: "",
            password: ""
        }
    }
    setError = (error: string) => {
        this.setState({ error: error })
    }
    setUser = ({ user, isUser }: any) => {
        if (isUser == 0) {
            this.setError('User is already logged in!');
        }
        else if (isUser == 1) {
            this.setError('Incorrect username or password!');
        }
        else if(isUser == 2){
            this.props.setUser(user);
            this.setError('');
        }
    }
    handleChange = (event: any) => {
        const { value } = event.target
        this.setState({
            nickname: value
        })
    }
    handlePassword = (event: any) => {
        const { value } = event.target
        this.setState({
            password: value
        }) 
    }
    handleSubmit = (event: any) => {
        event.preventDefault();
        const { nickname, password } = this.state;
        CM.emitVerifyUser(nickname, password, this.setUser);
    }

    render() {
        const { nickname, error } = this.state
        return (
            <div className={'loginForm'}>
                <form onSubmit={this.handleSubmit}>
                    <label htmlFor='nickname'>Enter your nickname:</label><br></br>
                    <input
                        ref={(input) => { this.textInput = input }}
                        type='text'
                        id='nickname'
                        value={nickname}
                        onChange={this.handleChange}
                        maxLength={16}
                        placeholder={'username'}
                        autoComplete={'off'}
                    />
                    <input
                        
                        type='password'
                        id='password'
                        onChange={this.handlePassword}
                        maxLength={16}
                        placeholder={'password'}
                    />
                    <input type="submit" onClick={this.handleSubmit} value="Login"></input>
                    <div className="error">{error ? error : null}</div>
                </form>
            </div>
        )
    }
}

export default LoginForm