import React, { Fragment, useState, Component } from "react";
import { Link } from "react-router-dom"
import { Navbar, Nav, Container, Row, Col } from 'react-bootstrap';
import { toast } from "react-toastify";


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
                            <Nav.Link href="/sitters">Sitters</Nav.Link>
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
}
