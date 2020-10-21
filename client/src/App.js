import React, { Fragment, useEffect, useState } from 'react';
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";


//components
import LandingPage from "./components/Landing";
import NavBar from "./components/NavBar"
import Homepage from "./components/Homepage";
import Register from "./components/Register";
import Login from "./components/Login";
import PCSAdmin from "./components/PCSAdmin";
import ContactUs from "./components/ContactUs";
import RegisterPet from "./components/RegisterPet";
import SetAvail from "./components/SetAvail";
import Profile from "./components/Profile";
import Sitters from './components/Sitters';
import TakeLeave from "./components/TakeLeave";
toast.configure();

function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const setAuth = (boolean) => {
    setIsAuthenticated(boolean);
  }
  const checkAuthenticated = async () => {
    try {
      const response = await fetch("http://localhost:5000/auth/verify", {
        method: "POST",
        headers: { token: localStorage.token }
      });

      const parseResponse = await response.json();
      parseResponse === true ? setIsAuthenticated(true) : setIsAuthenticated(false);
      console.log(isAuthenticated)
    } catch (err) {
      // console.error(err.message);
    }
  };


  useEffect(() => {
    checkAuthenticated()
  });

  return (
    <Fragment>
      <NavBar isAuth={isAuthenticated} setAuth={setAuth} />

      <Router>
        <Switch>
          <Route exact path="/" render={props =>
            (<LandingPage {...props} setAuth={setAuth} />)} />

          <Route exact path="/login" render={props => !isAuthenticated ?
            (<Login {...props} setAuth={setAuth} />) : (<Redirect to="/home" />)} />

          <Route exact path="/register" render={props => !isAuthenticated ?
            (<Register {...props} setAuth={setAuth} />) : (<Redirect to="/home" />)} />

          <Route exact path="/PCS" render={(props) => !isAuthenticated ?
            (<Login {...props} setAuth={setAuth} />) : (<PCSAdmin {...props} setAuth={setAuth} />)} />

          <Route exact path="/contact" render={props => !isAuthenticated ?
            (<Login {...props} setAuth={setAuth} />) : (<ContactUs {...props} setAuth={setAuth} />)} />

          <Route exact path="/registerpet" render={props => !isAuthenticated ?
            (<Login {...props} setAuth={setAuth} />) : (<RegisterPet {...props} setAuth={setAuth} />)} />

          <Route exact path="/takeleave" render={props => !isAuthenticated ?
            (<Login {...props} setAuth={setAuth} />) : (<TakeLeave {...props} setAuth={setAuth} />)} />

          <Route exact path="/setavail" render={props => !isAuthenticated ?
            (<Login {...props} setAuth={setAuth} />) : (<SetAvail {...props} setAuth={setAuth} />)} />

          <Route exact path="/profile" render={props => !isAuthenticated ?
            (<Login {...props} setAuth={setAuth} />) : (<Profile {...props} setAuth={setAuth} />)} />

          <Route exact path="/home" render={props => isAuthenticated ?
            (<Homepage {...props} setAuth={setAuth} />) : (<LandingPage {...props} setAuth={setAuth} />)} />

          <Route exact path="/sitters" render={props => !isAuthenticated ?
            (<Login {...props} setAuth={setAuth} />) : (<Sitters {...props} setAuth={setAuth} />)} />

          {/* <Route exact path="/sitters" render={props =>
            (<Sitters {...props} setAuth={setAuth} />)} /> */}

        </Switch>
      </Router>
    </Fragment>
  );
}

export default App;
