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






                {/* <div class="card-body">
                            <form name="">
                                <h3 class="text-center">
                                    <strong>Write to us:</strong>
                                </h3>
                                <hr></hr>

                                <div class="md-form">
                                    <i class="fas fa-user prefix grey-text"></i>
                                    <input type="text" id="form3" class="form-control"></input>
                                    <label for="form3">Your name</label>
                                </div>
                                <div class="md-form">
                                    <i class="fas fa-envelope prefix grey-text"></i>
                                    <input type="text" id="form2" class="form-control"></input>
                                    <label for="form2">Your email</label>
                                </div>

                                <div class="md-form">
                                    <i class="fas fa-pencil-alt prefix grey-text"></i>
                                    <textarea type="text" id="form8" class="md-textarea"></textarea>
                                    <label for="form8">Your message</label>
                                </div>

                                <div class="text-center">
                                    <button class="btn btn-indigo">Send</button>
                                    <hr></hr>
                                    <fieldset class="form-check">
                                        <input type="checkbox" class="form-check-input" id="checkbox1"></input>
                                        <label for="checkbox1" class="form-check-label dark-grey-text">Subscribe me to the newsletter</label>
                                    </fieldset>
                                </div>
                            </form>
                        </div> */}



            </Jumbo>


            <div class="container-fluid">
                <div class="card" style={{ width: "30rem" }}>
                    <div class="card-body">
                        <div class="form-group">
                            <label for="formGroupExampleInput">Select your pet:</label>
                            <select class="form-control form-control-lg">
                                <option>Dog</option>
                                <option>Cat</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="formGroupExampleInput">Select service type:</label>
                            <select class="form-control form-control-lg">
                                <option>Large select</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label for="formGroupExampleInput">Select (?)</label>
                            <select class="form-control form-control-lg">
                                <option>Large select</option>
                            </select>
                        </div>
                        <button type="button" class="btn btn-success">Search!</button>
                    </div>
                </div>
            </div>

        </Fragment>
    );

};

export default LandingPage;