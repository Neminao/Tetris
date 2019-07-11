import React from 'react';

import CM from './ClientManager';

class Register extends React.Component<{setDisplay: any}, {
    name: string, password: string, error: string;
}> {
    constructor(props: any) {
        super(props);
        this.state = {
            name: '',
            password: '',
            error: ''
        }

    }

    componentDidMount = () => {
        CM.initRegister(this.setError, this.props.setDisplay);
    }

    register = (event: any) => {
        event.preventDefault();
        const { name, password } = this.state;
        if (password.length > 5) {
            console.log("Username: " + name);
            CM.emitRegister(name, password);
            this.setError("");
            
        }
        else {
            this.setError("Password must contain at least 6 characters!");
        }
    }
    changeName = (event: any) => {
        event.preventDefault();
        this.setState({
            name: event.target.value
        })
    }
    changePass = (event: any) => {
        event.preventDefault();
        this.setState({
            password: event.target.value
        })
    }
    setError = (error: string) => {
        this.setState({ error });
    }
    render = () => {
        const { error } = this.state;
        const {setDisplay } = this.props;
        return (
            <div className='loginForm'>
            New user registration<hr></hr>
                <div className='error'>{error ? error : null}</div>
                <form onSubmit={this.register}>
                    
                    Enter username:
                    <input
                        onChange={this.changeName}
                        type='text'
                        placeholder='username...'></input>
                        <br></br>
                    Enter password:
                    <input
                        onChange={this.changePass}
                        type='password'
                        placeholder='password...'></input>
                    <input type='submit' value={'Submit'}></input>
                </form>
                <button value={0} onClick={setDisplay}>Back</button>
                <button value={1} onClick={setDisplay}>Login</button>
            </div>
        )
    }
}

export default Register;