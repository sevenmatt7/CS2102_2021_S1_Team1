import React, { Fragment, useState, Component } from "react";
import { Link } from "react-router-dom"
import { Navbar, Nav, Container, Row, Col, Jumbotron as Jumbo } from 'react-bootstrap';
import Nav_bar from "./Nav_bar.js"
import LandingBg from '../Assets/Images/LandingBg.jpg';

const LandingPage = () => {

    return (
        <Fragment>
            <Nav_bar />

            <style>
                {`
                     .jumbo {
                        background: url(${LandingBg}) no-repeat fixed bottom;
                        background-size: cover;
                        color: #efefef;
                        height: 500px;
                        position: relative;
                        z-index: -2;
                      }
                      .overlay {
                        background-color: #000;
                        opacity: 0.6;
                        position: absolute;
                        top: 0;
                        left: 0;
                        bottom: 0;
                        right: 0;
                        z-index: -1;
                      }
                    `}
            </style>

            <Jumbo fluid className="jumbo">
                <div className="overlay"></div>
                <Container>
                    <h1>Welcome</h1>
                    <p>Learn to code from my YouTube videos</p>
                </Container>
            </Jumbo>


            <Container fluid="md" style={{ padding: 55 }}>
                <Row>
                    <Col>
                        <h1 class="display-4 font-weight-bold text-center" style={{ marginBottom: 16 }}>
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