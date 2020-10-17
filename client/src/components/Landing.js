import React, { Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom"
import { Navbar, Nav, Container, Form, Row, Col, Jumbotron as Jumbo } from 'react-bootstrap';
import mag from "../Assets/Images/mag.png";
import book from "../Assets/Images/book.png";
import dog from "../Assets/Images/dog.png";

const LandingPage = () => {

    // const [pet, setPet] = useState([
    //     "Dog",
    //     "Cat",
    //     "Fish",
    //     "Rabbit",
    //     "Bird",
    //     "Reptile"
    // ]);
    // const [name, setName] = useState("");
    // const addPet = (name) => {
    //     setPet([...pet, name])
    // };
    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     addPet(name)
    //     setName("");
    // };

    const [redirect, setRedirect] = useState(false);

    const [query, setQuery] = useState(
        { animal_type: "", from: "", to: "" }
    );

    const onSelect = (e) => {
        setQuery({ ...query, [e.target.id]: e.target.value });
    }

    const handleSubmitForm = async (e) => {
        try {
            e.preventDefault();
            setRedirect(true);
        } catch (error) {
            console.log(error.message)
        }

    };

    // if (redirect) {
    //     return <Redirect to={{
    //         pathname: '/sitters',
    //         state: query
    //       }} />;
    // }
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

            {/* <div>
                <ul>
                    {pet.map(pet => {
                        return (
                            <li key={pet}> {pet} </li>
                        );
                    })}
                </ul>
                <form onSubmit={handleSubmit}>
                    <label> Pet Name </label>
                    <input type="text" value={name} required placeholder="Enter pet..." onChange={(e) => setName(e.target.value)} />
                    <input type="submit" value="Add Pet" />
                </form>
            </div> */}

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

            {/* <div class="card mx-auto" style={{ width: "30rem", backgroundColor: "#eaddf7" }}>
                <div class="card-body">
                    <label> Select your pet: {query.animal_type}</label>
                    <div class="container">
                        <button type="button" id="animal_type" class="btn btn-outline-info" value="dog"
                            onClick={(e) => onSelect(e)}>Dog</button>
                        <button type="button" id="animal_type" class="btn btn-outline-info" value="cat"
                            onClick={(e) => onSelect(e)}>Cat</button>
                        <button type="button" id="animal_type" class="btn btn-outline-info" value="fish"
                            onClick={(e) => onSelect(e)}>Fish</button>
                        <button type="button" id="animal_type" class="btn btn-outline-info" value="rabbit"
                            onClick={(e) => onSelect(e)}>Rabbit</button>
                        <button type="button" id="animal_type" class="btn btn-outline-info" value="bird"
                            onClick={(e) => onSelect(e)}>Bird</button>
                        <button type="button" id="animal_type" class="btn btn-outline-info" value="reptile"
                            onClick={(e) => onSelect(e)}>Reptile</button>
                    </div>

                    <div className="md-form mb-4 mt-4">
                        <label data-error="wrong" data-success="right" htmlFor="startDate">Start Date: {query.from}</label>
                        <input type="date"
                            id="from"
                            name="from"
                            value={query.from}
                            onChange={e => onSelect(e)}
                            className="form-control validate"
                            min="2020-01-01"
                            max="2099-12-31"
                            required="required" />
                    </div>

                    <div className="md-form mb-4">
                        <label data-error="wrong" data-success="right" htmlFor="endDate">End Date: {query.to}</label>
                        <input type="date"
                            id="to"
                            name="to"
                            value={query.to}
                            onChange={e => onSelect(e)}
                            className="form-control validate"
                            min="2020-01-01"
                            max="2099-12-31"
                            required="required" />
                    </div>
                    <div className="card-footer">
                        <button type="submit" className="btn btn-primary" onClick={handleSubmitForm}>Search</button>
                    </div>
                </div>
            </div> */}



        </Fragment >
    );

};

export default LandingPage;