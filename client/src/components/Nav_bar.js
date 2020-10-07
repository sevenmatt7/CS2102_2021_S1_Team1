import React, { Fragment, useState, Component } from "react";
import { Link } from "react-router-dom"
import { Navbar, Nav, Container, Row, Col } from 'react-bootstrap';


//New implementation of navigation bar. To add to component, just add <Nav_bar /> under the <Fragment> of the component
//and import Nav_bar from "./Nav_bar.js"


export default function Nav_bar() {
    return (
        <Fragment>
            <Navbar variant="dark" expand="md" sticky="top" style={{ padding: "0", backgroundColor: "#b19cd9" }}>
                <Container>
                    <Navbar.Brand style={{ paddingTop: "0" , marginRight: "2rem"}} href="/">
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
                            <Nav.Link href="/FAQ">FAQ</Nav.Link> 
                            <Nav.Link href="/registerpet">Pet registration</Nav.Link> 
                        </Nav>
                        <Nav>
                            <Nav.Link href="/login">Login</Nav.Link>
                            <Nav.Link eventKey={2} href="/register">
                                Register
                        </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </Fragment>
    );
}
