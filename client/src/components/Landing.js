import React, { Fragment } from "react";
import { Jumbotron as Jumbo } from 'react-bootstrap';
import mag from "../Assets/Images/mag.png";
import book from "../Assets/Images/book.png";
import dog from "../Assets/Images/dog.png";

const LandingPage = () => {

    return (
        <Fragment>

            <Jumbo fluid className="jumbo">
                <div className="overlay"></div>

                <div class="container flex text-center centerme">
                    <h1 class="display-3 font-weight-bold">Welcome to Pet Society!</h1>
                    <hr color="white"></hr>
                    <p>Browse services offered by our trusted sitters, based on what you or your beloved pet needs.</p>
                </div>

            </Jumbo>

            <div class="container mt-5">
                <div class="row text-center">
                    <div class="col-md-4 mb-5">
                        <div class="card h-100">
                            <div class="card-body">
                                <img src={mag} style={{ padding: 10 }} />
                                <h2 class="card-title">Search</h2>
                                <p class="card-text">Read verified reviews and search for your perfect sitter.</p>
                            </div>
                            <a href="/sitters" class="btn btn-primary btn-sm">Begin Search</a>

                        </div>
                    </div>
                    <div class="col-md-4 mb-5">
                        <div class="card h-100">
                            <div class="card-body">
                                <img src={book} style={{ padding: 10 }} />
                                <h2 class="card-title">Book</h2>
                                <p class="card-text">Book a sitter based on your pet's requirements.</p>
                            </div>
                            <a href="/login" class="btn btn-primary btn-sm">Login To Book</a>
                        </div>
                    </div>
                    <div class="col-md-4 mb-5">
                        <div class="card h-100">
                            <div class="card-body">
                                <img src={dog} style={{ padding: 10 }} />
                                <h2 class="card-title">Register</h2>
                                <p class="card-text">Sign up as one of our trusted sitters!</p>
                            </div>
                            <a href="/register" class="btn btn-primary btn-sm">Register As Caretaker</a>
                        </div>
                    </div>
                </div>
            </div>

        </Fragment >
    );

};

export default LandingPage;