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

                <div className="container flex text-center centerme">
                    <h1 className="display-3 font-weight-bold">Welcome to Pet Society!</h1>
                    <hr color="white"></hr>
                    <p>Browse services offered by our trusted sitters, based on what you or your beloved pet needs.</p>
                </div>

            </Jumbo>

            <div className="container mt-5">
                <div className="row text-center">
                    <div className="col-md-4 mb-5">
                        <div className="card h-100">
                            <div className="card-body">
                                <img src={mag} style={{ padding: 10 }} alt = 'book'/>
                                <h2 className="card-title">Search</h2>
                                <p className="card-text">Read verified reviews and search for your perfect sitter.</p>
                            </div>
                            <a href="/c/sitters" className="btn btn-primary btn-sm">Begin Search</a>

                        </div>
                    </div>
                    <div className="col-md-4 mb-5">
                        <div className="card h-100">
                            <div className="card-body">
                                <img src={book} style={{ padding: 10 }} alt='book'/>
                                <h2 className="card-title">Book</h2>
                                <p className="card-text">Book a sitter based on your pet's requirements.</p>
                            </div>
                            <a href="/c/login" className="btn btn-primary btn-sm">Login To Book</a>
                        </div>
                    </div>
                    <div className="col-md-4 mb-5">
                        <div className="card h-100">
                            <div className="card-body">
                                <img src={dog} style={{ padding: 10 }} alt='puppy'/>
                                <h2 className="card-title">Register</h2>
                                <p className="card-text">Sign up to be one of our trusted sitters!</p>
                            </div>
                            <a href="/c/register" className="btn btn-primary btn-sm">Register As Caretaker</a>
                        </div>
                    </div>
                </div>
            </div>

        </Fragment >
    );

};

export default LandingPage;