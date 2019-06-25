import React, { Component } from 'react';
import UniversalShapeContext from './UniversalShapeContext';
import Register from './Register';


class Main extends Component<{},{display: number}> {
  constructor(props: any){
    super(props);
    this.state={
      display: 0
      }
  }
  setDisplay = (display: number) => {
    this.setState({
      display
    })
  }
  handleClick = (event: any) => { 
      this.setState({display: event.target.value});
  }
  render() {
    const {display} = this.state;
    return (
      <div >
        {display == 0 ? <div className="register"><button onClick = {this.handleClick} value = {1}>Login</button> 
        <button onClick = {this.handleClick} value = {2}>Register</button> </div>: null}
        {display == 1 ? <div><UniversalShapeContext /> </div>: null }
        {display == 2 ? <div className="register"><button onClick = {this.handleClick} value = {1}>Login</button> 
        <button onClick = {this.handleClick} value = {2}>Register</button> <Register setDisplay={this.setDisplay}/> </div>: null }
        {display == 3 ? <div className="register">
          Register Successful!
          <button onClick = {this.handleClick} value = {1}>Login</button> 
        </div> : null }
      </div>
    );
  }
}

export default Main;