import React, { Component } from 'react';
import Register from './Register';
import LoginForm from './LoginForm';
import CM from './ClientManager'
import Menu from './Menu';


class Main extends Component<{}, { display: number; user: any }> {
  constructor(props: any) {
    super(props);
    this.state = {
      display: 0,
      user: null
    }
  }
  setDisplay = (display: number) => {
    this.setState({
      display
    })
  }
  handleClick = (event: any) => {
    this.setState({ display: event.target.value });
  }
  setUser = (user: any) => {
    CM.emitUserConnected(user);
    this.setState({ user, display: 4 })
  }
  render() {
    const { display, user } = this.state;
    return (
      <div >

        {display == 0 ? <div>
          <p className='title'>TETRIS</p>
          <div className="register">

            <button onClick={this.handleClick} value={1}>Login</button>
            <button onClick={this.handleClick} value={2}>Register</button> </div> </div> : null}
        {display == 1 ? <div><LoginForm setUser={this.setUser} setDisplay={this.handleClick} /> </div> : null}
        {display == 2 ? <div ><Register setDisplay={this.handleClick} /> </div> : null}
        {display == 3 ? <div className="register">
          Register Successful!
          <button onClick={this.handleClick} value={1}>Login</button>
        </div> : null}
        {user ? <div ><Menu user={user} /> </div> : null}
      </div>
    );
  }
}

export default Main;