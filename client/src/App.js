import React, {Fragment, useState} from 'react';

import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";


//components
 import InputItem from "./components/Input";
 import ListItems from "./components/ItemList";
 import Homepage from "./components/Homepage";
 import Register from "./components/Register";
 import Login from "./components/Login";

function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const setAuth = (boolean) => {
    setIsAuthenticated(boolean);
  }

  return (
    <Fragment>
      <Router>
        <div className="container">
          <Switch>
            <Route exact path = "/login" render={props => !isAuthenticated ? 
              (<Login {...props} setAuth={setAuth}/>) : (<Redirect to="/home" />) } />
            <Route exact path = "/register" render={props => !isAuthenticated ? 
              (<Register {...props} setAuth={setAuth}/>) : (<Redirect to="/home" />)}/>
            <Route exact path = "/home" render={props => isAuthenticated ? 
            (<Homepage {...props} setAuth={setAuth}/>) : (<Login {...props} />) }/>
          </Switch>
        </div>
      </Router>
      <div className="container">
      <InputItem />
      <ListItems />
      <Homepage />
      </div>
      
      
    </Fragment>
  );
}

export default App;
