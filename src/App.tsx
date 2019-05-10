import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Wrapper from './Wrapper';
import UniversalShapeContext from './UniversalShapeContext';


class App extends Component {
  render() {
    return (
      <div className="App">
        <UniversalShapeContext />
      </div>
    );
  }
}

export default App;
