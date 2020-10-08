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
import PetOwner from "./components/PetOwner";
import PCSAdmin from "./components/PCSAdmin";
import ContactUs from "./components/ContactUs";
import RegisterPet from "./components/RegisterPet";
import SetAvail from "./components/SetAvail";
import Profile from "./components/Profile";
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
      <NavBar isAuth={isAuthenticated} setAuth={setAuth}/>
      
      <Router>
          <Switch>
            <Route exact path="/" render={props => !isAuthenticated ?
              (<LandingPage {...props} setAuth={setAuth} />) : (<Redirect to="/home" />)} /> 
            
            <Route exact path="/login" render={props => !isAuthenticated ?
              (<Login {...props} setAuth={setAuth} />) : (<Redirect to="/home" />)} />
            
            <Route exact path="/register" render={props => !isAuthenticated ?
              (<Register {...props} setAuth={setAuth} />) : (<Redirect to="/home" />)} />    
            
            <Route exact path="/PCS" render={(props) => !isAuthenticated ?
              (<Redirect to="/login" />) : (<PCSAdmin {...props} setAuth={setAuth} />)} />

            <Route exact path="/contact" render={props => !isAuthenticated ?
              (<Login {...props} setAuth={setAuth} />) : (<ContactUs {...props} setAuth={setAuth} />)} />

            <Route exact path="/registerpet" render={props => !isAuthenticated ?
              (<Login {...props} setAuth={setAuth} />) : (<RegisterPet {...props} setAuth={setAuth} />)} />

            <Route exact path="/setavail" render={props => !isAuthenticated ?
              (<Login {...props} setAuth={setAuth} />) : (<SetAvail {...props} setAuth={setAuth} />)} />

            <Route exact path="/profile" render={props => !isAuthenticated ?
              (<Login {...props} setAuth={setAuth} />) : (<Profile {...props} setAuth={setAuth} />)} />

            <Route exact path="/home" render={props => isAuthenticated ?
              (<Homepage {...props} setAuth={setAuth} />) : (<Login {...props} setAuth={setAuth} />)} />
          </Switch>
      </Router>
    </Fragment>
  );
}

export default App;
