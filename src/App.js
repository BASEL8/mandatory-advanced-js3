import React, { Component } from "react";
import Nav from "./components/Nav";
import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import { Route, Switch, Redirect } from "react-router-dom";
import "./App.css";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Nav />
        <Switch>
          <Route path="/home" component={Home} />
          <Route path="/register" component={Register} />
          <Route path="/login" component={Login} />
          <Redirect from="/" to="/Login" />
        </Switch>
      </div>
    );
  }
}

export default App;
