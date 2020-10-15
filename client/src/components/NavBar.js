import React, { Fragment, useState, Component } from "react";
import { Link } from "react-router-dom"
<<<<<<< HEAD

//Older implementation of the navigation bar

const NavBar = () => {
  return (
    <Fragment>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand" to="/">Pet Society</Link>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExample07" aria-controls="navbarsExample07" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon">lol</span>
          </button>

          <div className="collapse navbar-collapse" id="navbarsExample07">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item active">
                <Link className="nav-link" to="/">Home<span className="sr-only">(current)</span></Link>
                {/* <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a> */}
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/contact">Contact Us</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/FAQ">FAQ</Link>
              </li>

              {/* <li className="nav-item">                                
                                <a className="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Disabled</a>
                            </li> */}
              <li className="nav-item dropdown">
                <a className="nav-link dropdown-toggle" href="#" id="dropdown07" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Dropdown</a>
                <div className="dropdown-menu" aria-labelledby="dropdown07">
                  <a className="dropdown-item" href="#">Action</a>
                  <a className="dropdown-item" href="#">Another action</a>
                  <a className="dropdown-item" href="#">Something else here</a>
                </div>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/home/RegisterPet">
                    Register Your Pet!
                </Link>
              </li>
            </ul>
            <form className="form-inline my-2 my-md-0">
              <input className="form-control" type="text" placeholder="Search" aria-label="Search" />
            </form>
          </div>
        </div>
      </nav>
    </Fragment>
  )
=======
import { Navbar, Nav, Container, Row, Col } from 'react-bootstrap';
import { toast } from "react-toastify";

//New implementation of navigation bar. To add to component, just add <Nav_bar /> under the <Fragment> of the component
//and import Nav_bar from "./Nav_bar.js"


export default function NavBar({isAuth, setAuth}) {
    
    const acc_type = localStorage.acc_type;
    const logout = async e => {
        e.preventDefault();
        try {
          localStorage.removeItem("token");
          localStorage.removeItem("acc_type");
          if (localStorage.emp_type) {
              localStorage.removeItem("emp_type");
          }
          setAuth(false);
          toast.success("Logout successfully");
        } catch (err) {
          console.error(err.message);
        }
      };

    return (
        <Fragment>
            <Navbar variant="dark" expand="md" sticky="top" style={{ padding: "0", backgroundColor: "#b19cd9" }}>
                <Container>
                    <Navbar.Brand style={{ paddingTop: "0" , marginRight: "2rem"}} href="/home">
                        <img
                            alt=""
                            src={process.env.PUBLIC_URL + '/PetSocietyShadow.png'}
                            width="175"
                            height="50"
                            className="d-inline-block align-top"
                        />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link href="/">Services</Nav.Link>
                            <Nav.Link href="/">Sitters</Nav.Link>
                            <Nav.Link href="/contact">Contact Us</Nav.Link>
                            {acc_type === "caretaker" && <Nav.Link href="/setavail">Indicate availabilites</Nav.Link>}
                            {acc_type === "petowner" && <Nav.Link href="/registerpet">Pet registration</Nav.Link>}
                        </Nav>
                        <Nav>
                            {!isAuth && <Nav.Link href="/login">Login</Nav.Link>}
                            {!isAuth && <Nav.Link eventKey={2} href="/register">Register</Nav.Link>}
                            {isAuth && <Nav.Link eventKey={3} href="/" onClick={e => logout(e)}>Logout</Nav.Link>}
                            {isAuth && <Nav.Link eventKey={4} href="/profile">My Profile</Nav.Link>}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </Fragment>
    );
>>>>>>> 0425d950e81201961774b8299d2578cac0411dd0
}
