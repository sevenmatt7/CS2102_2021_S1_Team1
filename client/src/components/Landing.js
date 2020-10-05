import React, { Fragment, useState, Component } from "react";
import { Link } from "react-router-dom"
import { Navbar, Nav, Container, Form, Row, Col, Jumbotron as Jumbo } from 'react-bootstrap';
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
                        margin-bottom: 0;
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

                <div class="container text-center">
                    <h1 class="display-3 font-weight-bold">Welcome to Pet Society!</h1>
                    <hr color="white"></hr>
                    <p>Browse services offered by our trusted sitters, based on what you or your beloved pet needs.</p>
                </div>

            </Jumbo>

            <div class="container-fluid  p-3" style={{backgroundColor: "#ffbbcb"}}>
                <div class="card mx-auto" style={{ width: "30rem", backgroundColor: "#81ceeb" }}>
                    <div class="card-body">
                        <div class="form-group">
                            <label for="formGroupExampleInput">Select your pet:</label>
                            <select class="form-control form-control-lg">
                                <option value="">-NIL-</option>
                                <option>Dog</option>
                                <option>Cat</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="formGroupExampleInput">Select service type:</label>
                            <select class="form-control form-control-lg">
                                <option value="">-NIL-</option>
                                <option>Large select</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="formGroupExampleInput">Select (?)</label>
                            <select class="form-control form-control-lg">
                                <option value="">-NIL-</option>
                                <option>Large select</option>
                            </select>
                        </div>
                        <div class="text-right">
                        <button type="button" class="btn btn-success">Search!</button>
                        </div>
                    </div>
                </div>
            </div>



        </Fragment>
    );

};

export default LandingPage;