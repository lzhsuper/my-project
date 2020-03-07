import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Login from './login_page';
import Homepage from './homePage'
import * as serviceWorker from './serviceWorker';
import {BrowserRouter as Router,Redirect,Route,Switch} from 'react-router-dom'
import 'typeface-roboto';
ReactDOM.render(
    <Router>
        <Switch>
        <Route path="/login" exact component={Login} />
        <Route path="/homePage"  component={Homepage}/>
        <Redirect to="/login" />
        </Switch>
    </Router>,document.getElementById('body')
);
serviceWorker.unregister();
