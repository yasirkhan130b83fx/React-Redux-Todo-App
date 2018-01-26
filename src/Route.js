import React, { Component } from 'react';
import { Route, Router } from 'react-router-dom';
import TodoApp from './components/TodoApp.js';
import History from './History.js';

class Routers extends Component {
    render() {
        return (
            <Router history={History}>
                <div>
                    <Route exact path="/" component={TodoApp} />
                </div>
            </Router>
        )
    }
}

export default Routers;