import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Main from './Main';
import About from './About';

function Nav () {
    return (
        <Router>
            <div>
            <Switch>
            <Route path="/" exact component={Main} />
            <Route path="/about/" component={About} />
            </Switch>
            </div>
        </Router>
    )
}

export default Nav;
