import React, { Component } from 'react';
// import * as GitHub from './services/github';
import './App.css';
import { Repos } from './Repos';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import { Config } from './Config'

class App extends Component {

  componentWillMount() {

  }
 
  render() {
    return (
      <div className="App disabled ugly rounded-corners red">
        <BrowserRouter>
          <Switch>
            <Route exact path='/' component={Repos} />
            <Route path='/config' component={Config} buttonText='Repos' />
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;