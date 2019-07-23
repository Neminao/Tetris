import React from 'react';
import {Link} from 'react-router-dom';

function About() {
    return (
        <div className='title'>
           <Link to="/about/">About</Link>
            
            <Link to="/">Main</Link>
            This is a tetris app.
        </div>
    )
}

export default About;