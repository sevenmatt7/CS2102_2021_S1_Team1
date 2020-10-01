import React, { Fragment, useState, Component } from "react";
import { Link } from "react-router-dom"
import { Navbar, Nav, Container, Row, Col } from 'react-bootstrap';
import "../components/navbar.css"


const LandingPage = () => {

    return (
        <Fragment>
            <Navbar className="navbar-pastelpurple" variant="dark" expand="md" fixed="top" style={{ padding: "0" }}>
                <Container>
                    <Navbar.Brand style={{ paddingTop: "0" }} href="/">
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
                            <Nav.Link href="/">Search Sitters</Nav.Link>
                            <Nav.Link href="/">Browse Services</Nav.Link>
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

            {/* {<h1 className="text-center mt-5 mb-5">Welcome to Pet Society!</h1>} */}
            {/* <form className="d-flex mt-5" onSubmit={onSubmitForm}>
                <input type="text" className="form-control" value={description} 
                onChange={e => setDescription(e.target.value)}/> 
                </form>*/}

            {/* <div class="view full-page-intro" >
                <div class="mask rgba-black-light d-flex justify-content-center align-items-center">
                    <div class="container">
                        <div class="row wow fadeIn">
                            <div class="col-md-6 mb-4 white-text text-center text-md-center">
                                <h1 class="display-4 font-weight-bold">Learn Bootstrap 4 with MDB</h1>
                                <p>
                                    <strong>Best & free guide of responsive web design</strong>
                                </p>
                                <p class="mb-4 d-none d-md-block">
                                    <strong>Book trusted sitters and dog walkers who'll treat your pets like family.</strong>
                                </p>
                                <a target="_blank" href="https://mdbootstrap.com/education/bootstrap/" class="btn btn-indigo btn-lg">Start free tutorial
                                    <i class="fas fa-graduation-cap ml-2"></i>
                                </a>
                            </div>
                            <div class="col-md-6 col-xl-5 mb-4">


                            </div>

                        </div>

                    </div>

                </div>

            </div> */}

            <Container fluid="md" style={{padding:55}}>
                <Row>
                    <Col>
                        <h1 class="display-4 font-weight-bold text-center" style={{marginBottom: 16}}>
                            Welcome to Pet Society!
                        </h1>
                        <h2 class="text-center">
                            <strong>Browse services and book trusted sitters who'll fulfill your pet's needs.</strong>
                        </h2>
                    </Col>
                </Row>
            </Container>



        </Fragment>
    );

};

export default LandingPage;