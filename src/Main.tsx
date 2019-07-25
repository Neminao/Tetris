import React, { Component } from 'react';
import Register from './Register';
import LoginForm from './LoginForm';
import CM from './ClientManager'
import Menu from './Menu';
import { Router, Link } from 'react-router-dom';
import {Timeline, TimelineLite, TimelineMax, Power2, TweenLite, TweenMax} from 'gsap';



class Main extends Component<{}, { display: number; user: any }> {
  title = React.createRef<HTMLDivElement>();
  constructor(props: any) {
    super(props);
    this.state = {
      display: 0,
      user: null
    }
  }

  componentDidMount(){
    this.animate();
  }
  componentDidUpdate(){
    if(this.state.display == 0) {
      this.animate();
    }
  }
  animate = () => {
    let tl = new TimelineMax();   
    tl.fromTo(this.title.current,1, {width: "0", left: '50%'}, {width: '100%',  left: '0%'})
    .fromTo(this.title.current,1,{color: 'rgba(255, 255, 255, 0)'},{color: '#595959', ease: Power2.easeInOut, }, "-=0.5");
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

  logout = () => {
    this.setState({
      display: 0,
      user: null
    })
  }

  render() {
    const { display, user } = this.state;
    return (
      <div className='main-container'>



        {user ? <div ><Menu user={user} logout={this.logout} /> </div> : <div>
          
          {display == 0 ? <div>
            <nav>
            <div className="register">
              <button onClick={this.handleClick} value={1}>Login</button>
              <button onClick={this.handleClick} value={2}>Register</button>
              <Link className={'mainLink'} to="/about/">About</Link> 
              <Link className={'mainLink'} to="/">Main</Link>
            </div>
            </nav>
            <div className='title' ref={this.title}>TETRIS</div>
          </div> : null}
          {display == 1 ? <div><LoginForm setUser={this.setUser} setDisplay={this.handleClick} /> </div> : null}
          {display == 2 ? <div ><Register setDisplay={this.handleClick} /> </div> : null}
          {display == 3 ? <div className="register">
            Register Successful!
          <button onClick={this.handleClick} value={1}>Login</button>
          </div> : null}</div>}

      </div>
    );
  }
}

export default Main;